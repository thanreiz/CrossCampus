import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot, SpeechBubble } from '../ui/Mascot.jsx'
import { checkAnswer } from '../lib/check.js'
import { speak, stopSpeaking, isSpeechSupported } from '../lib/speech.js'
import { askTeacherGabay, SOURCE } from '../lib/tutor.js'
import {
  createRecognizer,
  isRecognitionSupported,
  createGeminiRecorder,
  isMediaRecorderSupported,
} from '../lib/voicein.js'

const SOURCE_LABEL = {
  [SOURCE.NANO]: 'On-device (offline)',
  [SOURCE.ONLINE]: 'Teacher Gabay (online)',
  [SOURCE.CACHED]: 'Naka-cache na paliwanag',
}

const LANGS = [
  { key: 'taglish', label: 'Taglish' },
  { key: 'fil', label: 'Filipino' },
  { key: 'en', label: 'English' },
]

const TABS = [
  { key: 'explain', label: 'Paliwanag' },
  { key: 'example', label: 'Halimbawa' },
  { key: 'practice', label: 'Pagsasanay' },
]

export default function Classroom({ competency, score, online, onAnswered, onExit }) {
  const c = competency
  const [lang, setLang] = useState('taglish')
  const [tab, setTab] = useState('explain')

  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // null | true | false
  const [done, setDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  // --- Teacher Gabay live tutor (Phase 2) ---
  const [askOpen, setAskOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState(null) // { text, source, fromCache }
  const [thinking, setThinking] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const item = c.items[idx]

  // What Teacher Gabay "says" - drives both the speech bubble and voice-out.
  const bubble = useMemo(() => {
    if (tab === 'explain') return c.explanation[lang]
    if (tab === 'example') return c.worked_example
    if (done) return `Tapos na! ${correctCount}/${c.items.length} tama. Magaling, iskolar!`
    if (result === true) return 'Tama!'
    if (result === false) return `Halos! Ang tamang sagot ay ${item.answer}. Subukan ulit sa susunod.`
    return `Tanong ${idx + 1} sa ${c.items.length}: Isulat ang sagot sa baba. Kaya mo 'yan!`
  }, [tab, lang, c, done, result, item, idx, correctCount])

  // Auto read aloud whenever Gabay's line changes (voice-out, works offline).
  useEffect(() => {
    speak(bubble)
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubble])

  function submit() {
    if (result !== null) return // already checked; wait for Next
    const ok = checkAnswer(item, input)
    setResult(ok)
    if (ok) setCorrectCount((n) => n + 1)
    onAnswered(c.ref, ok)
  }

  function next() {
    if (idx + 1 >= c.items.length) {
      setDone(true)
      return
    }
    setIdx((i) => i + 1)
    setInput('')
    setResult(null)
  }

  function restart() {
    setIdx(0)
    setInput('')
    setResult(null)
    setDone(false)
    setCorrectCount(0)
    setTab('practice')
  }

  // Ask Teacher Gabay (Nano -> /api/tutor  - cached). Speaks the reply aloud.
  async function askGabay(q) {
    const text = (q ?? question).trim()
    if (!text || thinking) return
    setThinking(true)
    setReply(null)
    stopSpeaking()
    try {
      const r = await askTeacherGabay(text, c.ref)
      setReply(r)
      speak(r.text)
    } catch {
      setReply({ text: 'May problema sa pagsagot. Subukan ulit.', source: SOURCE.CACHED })
    } finally {
      setThinking(false)
    }
  }

  // Voice-IN - online only. Best path: Gemini transcription (best Taglish);
  // falls back to the browser Web Speech API. Recognized text auto-asks Gabay.
  function startWebSpeech() {
    const rec = createRecognizer({
      onResult: (text) => {
        setQuestion(text)
        askGabay(text)
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    })
    if (!rec) {
      setListening(false)
      return
    }
    recRef.current = rec
    setListening(true)
    rec.start()
  }

  function toggleMic() {
    if (listening) {
      // For the Gemini recorder, stop() ends recording -> upload -> transcribe.
      recRef.current?.stop()
      return
    }

    // Prefer Gemini transcription when online + MediaRecorder available.
    if (online && isMediaRecorderSupported()) {
      const rec = createGeminiRecorder({
        onStart: () => setListening(true),
        onResult: (text) => {
          setQuestion(text)
          askGabay(text)
        },
        onError: (err) => {
          // Server has no STT creds, or transcription failed -> Web Speech.
          if (err === 'stt-unconfigured' || err === 'stt-failed') {
            startWebSpeech()
          }
        },
        onEnd: () => setListening(false),
      })
      if (rec) {
        recRef.current = rec
        rec.start()
        return
      }
    }

    // Fallback — Web Speech API.
    startWebSpeech()
  }

  // Stop any recognizer on unmount.
  useEffect(() => () => recRef.current?.stop(), [])

  return (
    <div className="gb-shell relative flex min-h-screen flex-col bg-cream px-4 pb-6 pt-4">
      {/* top bar */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <button className="gb-chip bg-white" onClick={onExit}>Exit</button>
        <RefBadge refId={c.ref} domain={c.domain} />
      </div>

      {/* CHALKBOARD */}
      <div className="rounded-card border-[2.5px] border-outline bg-[#27433b] p-4 text-cream shadow-hard">
        <div className="mb-3 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border-2 border-cream/70 px-3 py-1 text-xs font-bold ${
                tab === t.key ? 'bg-yellow text-ink' : 'text-cream'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'explain' && (
          <>
            <div className="mb-3 flex gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`rounded-full border-2 border-cream/60 px-2.5 py-0.5 text-xs font-bold ${
                    lang === l.key ? 'bg-mint text-ink' : 'text-cream'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="font-display text-lg leading-snug">{c.explanation[lang]}</p>
          </>
        )}

        {tab === 'example' && (
          <p className="font-display text-lg leading-snug">{c.worked_example}</p>
        )}

        {tab === 'practice' &&
          (done ? (
            <div className="text-center">
            <p className="font-display text-2xl font-extrabold">Tapos na!</p>
              <p className="mt-1 text-lg">
                {correctCount} / {c.items.length} tama
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-cream/70">
                Tanong {idx + 1} / {c.items.length}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-snug">{item.q}</p>
              {item.type === 'mcq' && item.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setInput(opt)}
                      className={`rounded-full border-2 border-cream/60 px-3 py-1 text-sm font-bold ${
                        input === opt ? 'bg-sky text-ink' : 'text-cream'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* TEACHER + speech bubble */}
      <div className="mt-5 flex items-end gap-3">
        <Mascot size={72} float />
        <div className="flex-1">
          <SpeechBubble speaking>{bubble}</SpeechBubble>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {isSpeechSupported() && (
          <button className="gb-chip bg-white" onClick={() => speak(bubble)}>Pakinggan ulit</button>
        )}
        <button className="gb-chip bg-lavender shadow-hard-sm" onClick={() => setAskOpen((v) => !v)}>Itaas ang kamay</button>
      </div>

      {/* ASK PANEL - live Teacher Gabay tutor */}
      {askOpen && (
        <div className="gb-card bg-white gb-pop mt-3 p-3">
          <div className="flex items-center gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askGabay()}
              placeholder="Itanong kay Teacher Gabay..."
              className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-2 font-bold outline-none focus:bg-cream"
            />
            {(isRecognitionSupported() || isMediaRecorderSupported()) && (
              <button
                onClick={toggleMic}
                disabled={!online}
                title={online ? 'Magsalita' : 'Mic - kailangan ng internet'}
                className={`gb-chip ${listening ? 'bg-rose animate-pulse' : 'bg-rose'} disabled:opacity-40`}
              >
                {listening ? 'Itigil' : 'Mic'}
              </button>
            )}
            <Button color="mint" onClick={() => askGabay()} disabled={thinking}>
              {thinking ? '...' : 'Tanong'}
            </Button>
          </div>
          {!online && (
            <p className="mt-2 text-xs text-ink/60">
              Offline: sasagot pa rin si Gabay gamit ang on-device AI o cached na paliwanag. Mic
              ay online lang.
            </p>
          )}
          {reply && (
            <div className="mt-3 rounded-card border-[2.5px] border-outline bg-cream p-3">
              <p className="mb-1 text-xs font-bold text-ink/60">
                {SOURCE_LABEL[reply.source] ?? ''} {reply.fromCache ? ' - cached' : ''}
              </p>
              <p className="leading-snug">{reply.text}</p>
              {isSpeechSupported() && (
                <button className="mt-2 gb-chip bg-white" onClick={() => speak(reply.text)}>Pakinggan</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* mastery */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-bold text-ink/70">Mastery</span>
        <MasteryBar score={score} />
        <span className="text-xs font-bold">{Math.round((score ?? 0.5) * 100)}%</span>
      </div>

      {/* DESK BAR */}
      <div className="mt-auto pt-5">
        {tab !== 'practice' ? (
          <Button color="yellow" className="w-full text-lg" onClick={() => setTab('practice')}>Simulan ang pagsasanay &rarr;</Button>
        ) : done ? (
          <div className="flex gap-2">
            <Button color="white" className="flex-1" onClick={restart}>Ulitin</Button>
            <Button color="mint" className="flex-1" onClick={onExit}>Tapos</Button>
          </div>
        ) : (
          <div className="gb-card bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">Desk</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
                placeholder="Isulat ang sagot..."
                inputMode={item.type === 'mcq' ? 'text' : 'decimal'}
                className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-2 font-bold outline-none focus:bg-cream"
              />
              {result === null ? (
                <Button color="mint" onClick={submit}>
                  Sumagot
                </Button>
              ) : (
                <Button color="sky" onClick={next}>
                  {idx + 1 >= c.items.length ? 'Tapusin' : 'Susunod &rarr;'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


