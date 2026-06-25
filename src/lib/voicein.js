// Voice-IN — student speaks their question. Best-available-first chain:
//   1. online -> MediaRecorder mic capture -> POST /api/transcribe (Gemini,
//      best Taglish accuracy)
//   2. fallback -> browser SpeechRecognition (Web Speech API, online-only, shaky)
//   3. floor -> the student just types (handled by the caller)
// The caller gates on navigator.onLine and picks the path.

// ---------------------------------------------------------------------------
// Path 2 — Web Speech API (fallback). lang='fil-PH' placeholder.
// ---------------------------------------------------------------------------
export function isRecognitionSupported() {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
}

// Returns a controller { start, stop } or null if unsupported.
// onResult(text), onError(err), onEnd() callbacks.
export function createRecognizer({ onResult, onError, onEnd, lang = 'fil-PH' } = {}) {
  if (!isRecognitionSupported()) return null
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  const rec = new Ctor()
  rec.lang = lang // placeholder — Taglish recognition is shaky; pre-test hard
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.continuous = false

  rec.onresult = (e) => {
    const text = e.results?.[0]?.[0]?.transcript ?? ''
    onResult?.(text)
  }
  rec.onerror = (e) => onError?.(e.error || 'speech-error')
  rec.onend = () => onEnd?.()

  return {
    start() {
      try {
        rec.start()
      } catch (err) {
        onError?.(String(err))
      }
    },
    stop() {
      try {
        rec.stop()
      } catch {
        /* noop */
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Path 1 — Gemini transcription via MediaRecorder (best Taglish). Online-only.
// ---------------------------------------------------------------------------
export function isMediaRecorderSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  )
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      // strip the "data:<mime>;base64," prefix
      const s = String(reader.result)
      resolve(s.slice(s.indexOf(',') + 1))
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Pick a mime the recorder + Gemini both accept.
function pickMime() {
  const prefs = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  for (const m of prefs) {
    if (window.MediaRecorder?.isTypeSupported?.(m)) return m
  }
  return '' // let the browser choose
}

// Returns a controller { start, stop } for a record -> transcribe cycle, or null
// if unsupported. onResult(text), onError(err), onEnd(), onStart() callbacks.
// stop() ends recording, which triggers upload + transcription.
export function createGeminiRecorder({ onResult, onError, onEnd, onStart } = {}) {
  if (!isMediaRecorderSupported()) return null

  let recorder = null
  let stream = null
  let chunks = []
  let cancelled = false

  async function transcribe(blob) {
    try {
      const mimeType = (blob.type || 'audio/webm').split(';')[0]
      const audio = await blobToBase64(blob)
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio, mimeType }),
      })
      if (!res.ok) {
        // 501 = server has no STT creds; let caller fall back to Web Speech.
        onError?.(res.status === 501 ? 'stt-unconfigured' : 'stt-failed')
        return
      }
      const data = await res.json()
      const text = (data.text || '').trim()
      if (text) onResult?.(text)
      else onError?.('stt-empty')
    } catch {
      onError?.('stt-network')
    } finally {
      onEnd?.()
    }
  }

  return {
    async start() {
      try {
        cancelled = false
        chunks = []
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mimeType = pickMime()
        recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
        recorder.ondataavailable = (e) => {
          if (e.data?.size) chunks.push(e.data)
        }
        recorder.onstop = () => {
          stream?.getTracks().forEach((t) => t.stop())
          if (cancelled) {
            onEnd?.()
            return
          }
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
          if (blob.size === 0) {
            onError?.('stt-empty')
            onEnd?.()
            return
          }
          transcribe(blob)
        }
        recorder.start()
        onStart?.()
      } catch (err) {
        stream?.getTracks().forEach((t) => t.stop())
        onError?.(err?.name === 'NotAllowedError' ? 'mic-denied' : String(err))
        onEnd?.()
      }
    },
    stop() {
      try {
        if (recorder && recorder.state !== 'inactive') recorder.stop()
      } catch {
        /* noop */
      }
    },
    cancel() {
      cancelled = true
      this.stop()
    },
  }
}
