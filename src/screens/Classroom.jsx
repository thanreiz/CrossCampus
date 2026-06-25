import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, RefBadge, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot, SpeechBubble } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer } from '../lib/check.js'
import { speak, stopSpeaking, pauseSpeaking, resumeSpeaking, isSpeechSupported } from '../lib/speech.js'
import { askTeacherGabay, SOURCE } from '../lib/tutor.js'
import { LANGS, answerHint, speechLang } from '../lib/lang.js'
import { feedbackFor } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicFull } from '../lib/topics.js'
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

const TABS = [
  { key: 'explain', label: 'Paliwanag' },
  { key: 'example', label: 'Halimbawa' },
  { key: 'practice', label: 'Pagsasanay' },
]

// Strip **bold** markup before reading text aloud.
function plain(s) {
  return String(s ?? '').replace(/\*\*/g, '')
}

export default function Classroom({ competency, score, online, lang = 'taglish', onLang, onAnswered, onExit }) {
  const c = competency
  const [tab, setTab] = useState('explain')

  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // null | true | false
  const [done, setDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState([]) // session log for the summary
  const [fb, setFb] = useState(null) // feedbackFor() of the current item
  const [paused, setPaused] = useState(false)

  // --- Teacher Gabay live tutor ---
  const [askOpen, setAskOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const recRef = useRef(null)

  const item = c.items[idx]

  // What Teacher Gabay "says" — drives both the bubble and voice-out.
  const bubble = useMemo(() => {
    if (tab === 'explain') return c.explanation[lang]
    if (tab === 'example') return c.worked_example
    if (done) return `Tapos na! ${correctCount} sa ${c.items.length} ang tama. Magaling, iskolar!`
    if (result !== null && fb) return fb.ok ? fb.headline : `${fb.headline} ${plain(fb.body)}`
    return `Tanong ${idx + 1} sa ${c.items.length}: Isulat ang sagot sa baba. Kaya mo 'yan!`
  }, [tab, lang, c, done, result, fb, idx, correctCount])

  // Auto read aloud whenever Gabay's line changes (voice-out, works offline).
  useEffect(() => {
    setPaused(false)
    speak(bubble, { lang })
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubble])

  async function submit() {
    if (result !== null) return
    const ok = checkAnswer(item, input)
    const f = feedbackFor(item, ok, lang, idx)
    setResult(ok)
    setFb(f)
    if (ok) setCorrectCount((n) => n + 1)
    const entry = { q: item.q, your: input.trim(), answer: item.answer, correct: ok, solution: item.solution }
    setAnswers((a) => [...a, entry])
    recordAttempt({ ref: c.ref, q: item.q, your: input.trim(), answer: item.answer, correct: ok, feedback: ok ? f.headline : f.body })
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
    setFb(null)
  }

  function restart() {
    setIdx(0)
    setInput('')
    setResult(null)
    setFb(null)
    setDone(false)
    setCorrectCount(0)
    setAnswers([])
    setTab('practice')
  }

  function togglePause() {
    if (paused) {
      resumeSpeaking()
      setPaused(false)
    } else {
      pauseSpeaking()
      setPaused(true)
    }
  }

  async function askGabay(q) {
    const text = (q ?? question).trim()
    if (!text || thinking) return
    setThinking(true)
    setReply(null)
    stopSpeaking()
    try {
      const r = await askTeacherGabay(text, c.ref, lang)
      setReply(r)
      speak(r.text, { lang })
    } catch {
      setReply({ text: 'May problema sa pagsagot. Subukan ulit.', source: SOURCE.CACHED })
    } finally {
      setThinking(false)
    }
  }

  function startWebSpeech() {
    const rec = createRecognizer({
      lang: speechLang(lang),
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
      // Voice cue so the learner isn't left in silence while we transcribe.
      setTranscribing(true)
      speak('Sandali, pinapakinggan kita...', { lang })
      recRef.current?.stop()
      return
    }

    if (online && isMediaRecorderSupported()) {
      const rec = createGeminiRecorder({
        onStart: () => setListening(true),
        onResult: (text) => {
          setTranscribing(false)
          setQuestion(text)
          askGabay(text)
        },
        onError: (err) => {
          setTranscribing(false)
          if (err === 'stt-unconfigured' || err === 'stt-failed') startWebSpeech()
        },
        onEnd: () => {
          setListening(false)
          setTranscribing(false)
        },
      })
      if (rec) {
        recRef.current = rec
        rec.start()
        return
      }
    }
    startWebSpeech()
  }

  useEffect(() => () => recRef.current?.stop(), [])

  return (
    <div className="gb-shell relative flex min-h-screen flex-col bg-cream px-4 pb-6 pt-4">
      {/* top bar — hide the Online label while answering so it isn't distracting */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <button className="gb-chip bg-white text-base" onClick={onExit}>Exit</button>
        <div className="flex items-center gap-2">
          {tab !== 'practice' && <OnlineBadge online={online} />}
          <RefBadge refId={c.ref} domain={c.domain} />
        </div>
      </div>

      {/* full child-friendly topic title */}
      <h1 className="mb-2 font-display text-xl font-extrabold leading-tight">{topicFull(c.ref, c.competency)}</h1>

      {/* CHALKBOARD */}
      <div className="rounded-card border-[2.5px] border-outline bg-[#27433b] p-4 text-cream shadow-hard">
        <div className="mb-3 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border-2 border-cream/70 px-3.5 py-1.5 text-sm font-bold ${
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
                  onClick={() => onLang?.(l.key)}
                  className={`rounded-full border-2 border-cream/60 px-3 py-1 text-sm font-bold ${
                    lang === l.key ? 'bg-mint text-ink' : 'text-cream'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="font-display text-lg leading-relaxed">{c.explanation[lang]}</p>
          </>
        )}

        {tab === 'example' && (
          <p className="font-display text-lg leading-relaxed">{c.worked_example}</p>
        )}

        {tab === 'practice' &&
          (done ? (
            <Summary answers={answers} correctCount={correctCount} total={c.items.length} />
          ) : (
            <div>
              {/* immediate feedback banner at the TOP of the question */}
              {result !== null && fb && (
                <div className={`mb-3 rounded-card border-2 p-3 ${fb.ok ? 'border-mint bg-mint/20' : 'border-yellow bg-yellow/20'}`}>
                  <p className="font-display text-base font-extrabold text-cream">{fb.headline}</p>
                  {!fb.ok && (
                    <p className="mt-1 text-sm leading-snug text-cream">
                      <RichText className="text-cream">{fb.body}</RichText>
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-cream/70">
                Tanong {idx + 1} / {c.items.length}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-snug">{item.q}</p>
              {item.type === 'mcq' && item.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => result === null && setInput(opt)}
                      className={`rounded-full border-2 border-cream/60 px-4 py-1.5 text-base font-bold ${
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

      {/* voice controls — listen / pause-resume / stop */}
      {isSpeechSupported() && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button className="gb-chip bg-white text-base" onClick={() => { setPaused(false); speak(bubble, { lang }) }}>
            Pakinggan ulit
          </button>
          <button className="gb-chip bg-white text-base" onClick={togglePause}>
            {paused ? 'Ituloy' : 'I-pause'}
          </button>
          <button className="gb-chip bg-white text-base" onClick={() => { setPaused(false); stopSpeaking() }}>
            Itigil
          </button>
          <button className="gb-chip bg-lavender shadow-hard-sm text-base" onClick={() => setAskOpen((v) => !v)}>
            Itaas ang kamay
          </button>
        </div>
      )}

      {/* ASK PANEL — live Teacher Gabay tutor */}
      {askOpen && (
        <div className="gb-card bg-white gb-pop mt-3 p-3">
          <div className="flex items-center gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askGabay()}
              placeholder="Itanong kay Teacher Gabay..."
              className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-2 text-base font-bold outline-none focus:bg-cream"
            />
            {(isRecognitionSupported() || isMediaRecorderSupported()) && (
              <button
                onClick={toggleMic}
                disabled={!online}
                title={online ? 'Magsalita' : 'Mic — kailangan ng internet'}
                className={`gb-chip text-base ${listening ? 'bg-rose animate-pulse' : 'bg-rose'} disabled:opacity-40`}
              >
                {listening ? 'Itigil' : transcribing ? '...' : 'Mic'}
              </button>
            )}
            <Button color="mint" onClick={() => askGabay()} disabled={thinking}>
              {thinking ? '...' : 'Tanong'}
            </Button>
          </div>
          {transcribing && (
            <p className="mt-2 text-sm font-bold text-ink/60">Pinapakinggan kita... sandali lang.</p>
          )}
          {!online && (
            <p className="mt-2 text-sm text-ink/60">
              Offline: sasagot pa rin si Gabay gamit ang on-device AI o cached na paliwanag. Mic ay online lang.
            </p>
          )}
          {reply && (
            <div className="mt-3 rounded-card border-[2.5px] border-outline bg-cream p-3">
              <p className="mb-1 text-xs font-bold text-ink/60">
                {SOURCE_LABEL[reply.source] ?? ''} {reply.fromCache ? ' - cached' : ''}
              </p>
              <p className="text-base leading-snug">{reply.text}</p>
              {isSpeechSupported() && (
                <button className="mt-2 gb-chip bg-white" onClick={() => speak(reply.text, { lang })}>Pakinggan</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* mastery */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-bold text-ink/70">Mastery</span>
        <MasteryBar score={score} />
        <span className="text-sm font-bold">{Math.round((score ?? 0.5) * 100)}%</span>
      </div>

      {/* DESK BAR */}
      <div className="mt-auto pt-5">
        {tab !== 'practice' ? (
          <Button color="yellow" className="w-full text-lg" onClick={() => setTab('practice')}>Simulan ang pagsasanay &rarr;</Button>
        ) : done ? (
          <div className="flex gap-2">
            <Button color="white" className="flex-1 text-lg" onClick={restart}>Ulitin</Button>
            <Button color="mint" className="flex-1 text-lg" onClick={onExit}>Tapos</Button>
          </div>
        ) : (
          <div className="gb-card bg-white p-3">
            <p className="mb-1.5 px-1 text-sm font-bold text-ink/60">{answerHint(lang)}</p>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
                disabled={result !== null}
                placeholder="Isulat ang sagot..."
                inputMode={item.type === 'mcq' ? 'text' : 'decimal'}
                className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-3 text-lg font-bold outline-none focus:bg-cream disabled:opacity-80"
              />
              {result === null ? (
                <Button color="mint" className="text-lg" onClick={submit}>
                  Sumagot
                </Button>
              ) : (
                <Button color="sky" className="text-lg" onClick={next}>
                  {idx + 1 >= c.items.length ? 'Tapusin' : 'Susunod'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Score summary: which were correct / wrong, with correct answer + explanation.
function Summary({ answers, correctCount, total }) {
  const wrong = answers.filter((a) => !a.correct)
  return (
    <div>
      <div className="text-center">
        <p className="font-display text-2xl font-extrabold">Tapos na!</p>
        <p className="mt-1 text-lg">
          {correctCount} / {total} tama
        </p>
        <div className="mt-2 flex justify-center gap-2 text-sm font-bold">
          <span className="gb-chip bg-mint text-ink">Tama: {correctCount}</span>
          <span className="gb-chip bg-rose text-ink">Mali: {total - correctCount}</span>
        </div>
      </div>
      {wrong.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-extrabold text-cream/80">Balikan natin ang mga namali:</p>
          <div className="flex flex-col gap-2">
            {wrong.map((a, i) => (
              <div key={i} className="rounded-card border-2 border-cream/40 bg-cream p-3 text-ink">
                <p className="text-sm font-bold">
                  <span className="text-ink/60">Tanong:</span> {a.q}
                </p>
                <p className="mt-1 text-sm font-bold">
                  <span className="text-ink/60">Sagot mo:</span>{' '}
                  <span className="text-rose-700">{a.your || '—'}</span>
                </p>
                <p className="mt-1 text-sm font-bold">
                  <span className="text-ink/60">Tamang sagot:</span>{' '}
                  <span className="text-green-700">{a.answer}</span>
                </p>
                {a.solution && (
                  <p className="mt-1 text-sm">
                    <span className="font-bold text-ink/60">Paliwanag:</span> <RichText>{a.solution}</RichText>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
