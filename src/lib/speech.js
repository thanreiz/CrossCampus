// Voice-OUT: Teacher Gabay reads replies aloud. Best-available-first chain:
//   1. online -> POST /api/tts (Google Cloud TTS fil-PH voice, natural)
//   2. floor  -> on-device speechSynthesis (works fully OFFLINE, robotic)
// Returned audio is cached in IndexedDB (tts:{hash}) so repeats cost nothing
// and replay works offline once heard.

import { get, set } from 'idb-keyval'

// ---------------------------------------------------------------------------
// speechSynthesis floor (offline, on-device). Prefers a Filipino voice.
// ---------------------------------------------------------------------------
let cachedVoices = []

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  cachedVoices = window.speechSynthesis.getVoices()
}

export function initVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

function pickFilipinoVoice() {
  if (!cachedVoices.length) refreshVoices()
  return (
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('fil')) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('tl')) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('en-ph')) ||
    null
  )
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function speakLocal(text) {
  if (!isSpeechSupported() || !text) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const fil = pickFilipinoVoice()
  if (fil) u.voice = fil
  u.rate = 0.95
  u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

// ---------------------------------------------------------------------------
// ElevenLabs online path + playback control.
// ---------------------------------------------------------------------------
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return (h >>> 0).toString(36)
}

let currentAudio = null

function stopAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause()
      if (currentAudio.src?.startsWith('blob:')) URL.revokeObjectURL(currentAudio.src)
    } catch {
      /* noop */
    }
    currentAudio = null
  }
}

// Play an audio blob. Resolves true once playback actually starts, false if
// the browser blocks/can't play it (e.g. autoplay policy) so the caller can
// fall back to speechSynthesis.
function playBlob(blob) {
  return new Promise((resolve) => {
    stopAudio()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null
      URL.revokeObjectURL(url)
    }
    audio.play().then(
      () => resolve(true),
      () => {
        URL.revokeObjectURL(url)
        if (currentAudio === audio) currentAudio = null
        resolve(false) // autoplay blocked / decode error
      },
    )
  })
}

// Try cloud TTS (with cache). Returns true only if audio actually played.
async function speakCloud(text) {
  const key = `tts:${hash(text)}`

  // Cached audio — works offline once heard, zero cost on repeat.
  try {
    const cached = await get(key)
    if (cached instanceof Blob && cached.size) {
      return await playBlob(cached)
    }
  } catch {
    /* fall through */
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    // 501 = TTS unconfigured, 5xx = failure -> use speechSynthesis floor.
    if (!res.ok) return false
    // Guard against non-audio responses (e.g. dev server returning index.html
    // when /api isn't running) — otherwise we'd "play" HTML and stay silent.
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('audio')) return false
    const blob = await res.blob()
    if (!blob.size) return false
    set(key, blob).catch(() => {}) // cache for offline replay; don't block
    return await playBlob(blob)
  } catch {
    return false
  }
}

// Public API — same signature as before. Tries cloud TTS, falls back to local.
export function speak(text) {
  if (!text) return
  stopSpeaking()
  speakCloud(text).then((ok) => {
    if (!ok) speakLocal(text)
  })
}

export function stopSpeaking() {
  stopAudio()
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
