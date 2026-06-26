import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, RefBadge, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot, SpeechBubble } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer } from '../lib/check.js'
import { speak, stopSpeaking, pauseSpeaking, resumeSpeaking, isSpeechSupported } from '../lib/speech.js'
import { askTeacherGabay, SOURCE } from '../lib/tutor.js'
import { LANGS, answerHint, speechLang } from '../lib/lang.js'
import { makeT, localize } from '../lib/i18n.js'
import { feedbackFor } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicFull } from '../lib/topics.js'
import { EarIcon, PlayCircleIcon, PauseCircleIcon, RaiseHandIcon } from '../ui/Icons.jsx'
import { sfx } from '../lib/sound.js'
import {
  createRecognizer,
  isRecognitionSupported,
  createGeminiRecorder,
  isMediaRecorderSupported,
} from '../lib/voicein.js'

const SOURCE_KEY = {
  [SOURCE.NANO]: 'class.source.nano',
  [SOURCE.ONLINE]: 'class.source.online',
  [SOURCE.CACHED]: 'class.source.cached',
}

const TABS = [
  { key: 'explain', tkey: 'class.tab.explain' },
  { key: 'example', tkey: 'class.tab.example' },
  { key: 'practice', tkey: 'class.tab.practice' },
]

// Strip **bold** markup before reading text aloud.
function plain(s) {
  return String(s ?? '').replace(/\*\*/g, '')
}

export default function Classroom({ competency, score, online, lang = 'taglish', onLang, onAnswered, onExit }) {
  const c = competency
  const tt = makeT(lang)
  const [tab, setTab] = useState('explain')

  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // null | true | false
  const [done, setDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState([]) // session log for the summary
  const [fb, setFb] = useState(null) // feedbackFor() of the current item
  const [paused, setPaused] = useState(false)
  const [nudge, setNudge] = useState(null) // 'needAnswer' | 'needNumber' | null — gentle input validation

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
    if (tab === 'explain') return localize(c.explanation, lang)
    if (tab === 'example') return localize(c.worked_example, lang)
    if (done) return tt('class.bubble.done', { correct: correctCount, total: c.items.length })
    if (result !== null && fb) return fb.ok ? fb.headline : `${fb.headline} ${plain(fb.body)}`
    return tt('class.bubble.intro', { n: idx + 1, total: c.items.length })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Validation: don't let an empty / meaningless answer count as an attempt.
    if (!input.trim()) {
      setNudge('needAnswer')
      return
    }
    if (item.type !== 'mcq' && !/\d/.test(input)) {
      setNudge('needNumber')
      return
    }
    setNudge(null)
    const locItem = { ...item, q: localize(item.q, lang), solution: localize(item.solution, lang) }
    const ok = checkAnswer(item, input)
    const f = feedbackFor(locItem, ok, lang, idx)
    setResult(ok)
    setFb(f)
    sfx(ok ? 'correct' : 'wrong')
    if (ok) setCorrectCount((n) => n + 1)
    const entry = { q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, solution: locItem.solution }
    setAnswers((a) => [...a, entry])
    recordAttempt({ ref: c.ref, q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, feedback: ok ? f.headline : f.body })
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
    setNudge(null)
  }

  function restart() {
    setIdx(0)
    setInput('')
    setResult(null)
    setFb(null)
    setNudge(null)
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
      setReply({ text: tt('class.askError'), source: SOURCE.CACHED })
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
      speak(tt('class.listeningShort'), { lang })
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
        <button className="gb-chip bg-white text-base" onClick={onExit}>{tt('common.exit')}</button>
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
              {tt(t.tkey)}
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
            <p className="font-display text-lg leading-relaxed">{localize(c.explanation, lang)}</p>
          </>
        )}

        {tab === 'example' && (
          <p className="font-display text-lg leading-relaxed">{localize(c.worked_example, lang)}</p>
        )}

        {tab === 'practice' &&
          (done ? (
            <Summary answers={answers} correctCount={correctCount} total={c.items.length} lang={lang} />
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
                {tt('common.question')} {idx + 1} / {c.items.length}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-snug">{localize(item.q, lang)}</p>
              {item.type === 'mcq' && item.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        if (result === null) {
                          setInput(opt)
                          setNudge(null)
                        }
                      }}
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

      {/* voice controls — listen again (ear) / pause-resume (play-pause circle) /
          raise hand (person). Stop removed: pause/play already covers it. */}
      {isSpeechSupported() && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-outline bg-white shadow-hard-sm active:translate-y-[1px]"
            onClick={() => { setPaused(false); speak(bubble, { lang }) }}
            aria-label={tt('class.listenAgain')}
            title={tt('class.listenAgain')}
          >
            <EarIcon size={26} />
          </button>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-outline bg-white shadow-hard-sm active:translate-y-[1px]"
            onClick={togglePause}
            aria-label={paused ? tt('class.play') : tt('class.pause')}
            title={paused ? tt('class.play') : tt('class.pause')}
          >
            {paused ? <PlayCircleIcon size={28} /> : <PauseCircleIcon size={28} />}
          </button>
          <button
            className="flex h-12 items-center gap-2 rounded-full border-[2.5px] border-outline bg-lavender px-3 shadow-hard-sm active:translate-y-[1px]"
            onClick={() => setAskOpen((v) => !v)}
            aria-label={tt('class.raiseHand')}
            title={tt('class.raiseHand')}
          >
            <RaiseHandIcon size={28} />
            <span className="pr-1 text-sm font-bold">{tt('class.raiseHand')}</span>
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
              placeholder={tt('class.askPlaceholder')}
              className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-2 text-base font-bold outline-none focus:bg-cream"
            />
            {(isRecognitionSupported() || isMediaRecorderSupported()) && (
              <button
                onClick={toggleMic}
                disabled={!online}
                title={online ? tt('class.speak') : tt('class.micOfflineTitle')}
                className={`gb-chip text-base ${listening ? 'bg-rose animate-pulse' : 'bg-rose'} disabled:opacity-40`}
              >
                {listening ? tt('class.micStop') : transcribing ? '...' : tt('class.mic')}
              </button>
            )}
            <Button color="mint" onClick={() => askGabay()} disabled={thinking}>
              {thinking ? '...' : tt('class.ask')}
            </Button>
          </div>
          {transcribing && (
            <p className="mt-2 text-sm font-bold text-ink/60">{tt('class.listening')}</p>
          )}
          {!online && (
            <p className="mt-2 text-sm text-ink/60">{tt('class.offlineNote')}</p>
          )}
          {reply && (
            <div className="mt-3 rounded-card border-[2.5px] border-outline bg-cream p-3">
              <p className="mb-1 text-xs font-bold text-ink/60">
                {(reply.source && tt(SOURCE_KEY[reply.source])) || ''} {reply.fromCache ? ' - cached' : ''}
              </p>
              <p className="text-base leading-snug">{reply.text}</p>
              {isSpeechSupported() && (
                <button
                  className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-outline bg-white shadow-hard-sm"
                  onClick={() => speak(reply.text, { lang })}
                  aria-label={tt('class.listenAgain')}
                  title={tt('class.listenAgain')}
                >
                  <EarIcon size={22} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* mastery */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-bold text-ink/70">{tt('common.mastery')}</span>
        <MasteryBar score={score} />
        <span className="text-sm font-bold">{Math.round((score ?? 0.5) * 100)}%</span>
      </div>

      {/* DESK BAR */}
      <div className="mt-auto pt-5">
        {tab !== 'practice' ? (
          <Button color="yellow" className="w-full text-lg" onClick={() => setTab('practice')}>{tt('class.startPractice')} &rarr;</Button>
        ) : done ? (
          <div className="flex gap-2">
            <Button color="white" className="flex-1 text-lg" onClick={restart}>{tt('class.repeat')}</Button>
            <Button color="mint" className="flex-1 text-lg" onClick={onExit}>{tt('common.done')}</Button>
          </div>
        ) : (
          <div className="gb-card bg-white p-3">
            <p className="mb-1.5 px-1 text-sm font-bold text-ink/60">
              {item.type === 'mcq' ? tt('class.pickAnswer') : answerHint(lang)}
            </p>
            <div className="flex items-center gap-2">
              {item.type !== 'mcq' && (
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    if (nudge) setNudge(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
                  disabled={result !== null}
                  placeholder={tt('common.answerPlaceholder')}
                  inputMode="decimal"
                  className="min-w-0 flex-1 rounded-full border-[2.5px] border-outline px-4 py-3 text-lg font-bold outline-none focus:bg-cream disabled:opacity-80"
                />
              )}
              {result === null ? (
                <Button
                  color="mint"
                  className={`text-lg disabled:opacity-50 ${item.type === 'mcq' ? 'w-full' : ''}`}
                  onClick={submit}
                  disabled={!input.trim()}
                >
                  {tt('class.answer')}
                </Button>
              ) : (
                <Button color="sky" className={`text-lg ${item.type === 'mcq' ? 'w-full' : ''}`} onClick={next}>
                  {idx + 1 >= c.items.length ? tt('common.finish') : tt('common.next')}
                </Button>
              )}
            </div>
            {nudge && (
              <p className="mt-2 px-1 text-sm font-extrabold text-[#c0414b]">{tt('common.' + nudge)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Score summary: which were correct / wrong, with correct answer + explanation.
function Summary({ answers, correctCount, total, lang = 'taglish' }) {
  const tt = makeT(lang)
  const wrong = answers.filter((a) => !a.correct)
  return (
    <div>
      <div className="text-center">
        <p className="font-display text-2xl font-extrabold">{tt('summary.done')}</p>
        <p className="mt-1 text-lg">
          {tt('summary.scoreLine', { correct: correctCount, total })}
        </p>
        <div className="mt-2 flex justify-center gap-2 text-sm font-bold">
          <span className="gb-chip bg-mint text-ink">{tt('common.correct')}: {correctCount}</span>
          <span className="gb-chip bg-rose text-ink">{tt('common.wrong')}: {total - correctCount}</span>
        </div>
      </div>
      {wrong.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-extrabold text-cream/80">{tt('class.reviewMissed')}</p>
          <div className="flex flex-col gap-2">
            {wrong.map((a, i) => (
              <div key={i} className="rounded-card border-2 border-cream/40 bg-cream p-3 text-ink">
                <p className="text-sm font-bold">
                  <span className="text-ink/60">{tt('common.question')}:</span> {a.q}
                </p>
                <p className="mt-1 text-sm font-bold">
                  <span className="text-ink/60">{tt('common.yourAnswer')}:</span>{' '}
                  <span className="text-rose-700">{a.your || '—'}</span>
                </p>
                <p className="mt-1 text-sm font-bold">
                  <span className="text-ink/60">{tt('common.correctAnswer')}:</span>{' '}
                  <span className="text-green-700">{a.answer}</span>
                </p>
                {a.solution && (
                  <p className="mt-1 text-sm">
                    <span className="font-bold text-ink/60">{tt('common.explanation')}:</span> <RichText>{a.solution}</RichText>
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
