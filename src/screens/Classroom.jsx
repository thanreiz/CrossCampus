import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, RefBadge, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot, SpeechBubble } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer, choiceOptions } from '../lib/check.js'
import { speak, stopSpeaking, pauseSpeaking, resumeSpeaking, isSpeechSupported } from '../lib/speech.js'
import { askTeacherGabay, SOURCE } from '../lib/tutor.js'
import { answerHint, speechLang } from '../lib/lang.js'
import { makeT, localize, localizeChoice } from '../lib/i18n.js'
import { feedbackFor, vibrateCorrect, vibrateWrong } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicTitleLocalized } from '../lib/topics.js'
import { EarIcon, PlayCircleIcon, PauseCircleIcon, RaiseHandIcon, LightbulbIcon } from '../ui/Icons.jsx'
import StepScaffold from '../ui/StepScaffold.jsx'
import { ChoiceVisual, QuestionVisual } from '../ui/LearningVisual.jsx'
import { visualKeyForCompetency } from '../lib/visual-assets.js'
import { lessonTeaching } from '../lib/lesson-teaching.js'
import { sfx } from '../lib/sound.js'
import './Classroom.css'
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

function uniqueIncorrectAnswers(answers = []) {
  const byQuestion = new Map()
  answers.forEach((answer) => {
    if (!answer.correct) byQuestion.set(answer.q, answer)
  })
  return [...byQuestion.values()]
}

export default function Classroom({ competency, questions, questionSource = 'bundled', score, answered = false, online, lang = 'taglish', onLang, onAnswered, onExit }) {
  const c = useMemo(() => ({ ...competency, items: questions?.length ? questions : competency.items }), [competency, questions])
  const teaching = useMemo(() => lessonTeaching(c), [c])
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
  const [feedbackReady, setFeedbackReady] = useState(false)
  const [avatarState, setAvatarState] = useState('nova-idle')
  const [showCorrectOverlay, setShowCorrectOverlay] = useState(false)
  const [stepsDone, setStepsDone] = useState(!(c.items[0]?.steps?.length > 0))
  const inputRef = useRef(null)
  const actionRef = useRef(null)

  // --- Teacher Gabay live tutor ---
  const [askOpen, setAskOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const recRef = useRef(null)

  const item = c.items[idx]
  const itemOptions = choiceOptions(item)
  const completionIncorrectAnswers = useMemo(() => uniqueIncorrectAnswers(answers), [answers])
  const completionCorrectCount = Math.max(0, c.items.length - completionIncorrectAnswers.length)

  useEffect(() => {
    setStepsDone(!(item?.steps?.length > 0))
  }, [item])

  // What Teacher Gabay "says" — drives both the bubble and voice-out.
  const bubble = useMemo(() => {
    if (tab === 'explain') return tt('class.bubble.explain')
    if (tab === 'example') return localize(teaching.example.teacherLine, lang)
    if (done) return tt('class.bubble.done', { correct: completionCorrectCount, total: c.items.length })
    if (result !== null && fb) return fb.ok ? fb.headline : `${fb.headline} ${plain(fb.body)}`
    return tt('class.bubble.intro', { n: idx + 1, total: c.items.length })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, lang, c, teaching, done, result, fb, idx, completionCorrectCount])

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
    if (!itemOptions && item.type === 'numeric' && !/\d/.test(input)) {
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
    if (ok) vibrateCorrect()
    else vibrateWrong()
    setAvatarState(ok ? 'nova-correct' : 'nova-wrong')
    setShowCorrectOverlay(ok)
    setFeedbackReady(false)
    window.setTimeout(() => setAvatarState('nova-idle'), ok ? 1500 : 500)
    window.setTimeout(() => setShowCorrectOverlay(false), 1500)
    window.setTimeout(() => {
      setFeedbackReady(true)
      window.setTimeout(() => actionRef.current?.focus(), 0)
    }, Math.max(2000, ok ? 1500 : 500))
    if (ok) setCorrectCount((n) => n + 1)
    const entry = { q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, solution: locItem.solution }
    setAnswers((a) => [...a, entry])
    recordAttempt({ ref: item.ref ?? c.ref, q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, feedback: ok ? f.headline : f.body, source: item.source ?? questionSource })
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
    setFeedbackReady(false)
  }

  function tryAgain() {
    setInput('')
    setResult(null)
    setFb(null)
    setNudge(null)
    setFeedbackReady(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
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

  const lessonTitle = topicTitleLocalized(c.ref, c.competency, lang)
  const lessonSupport = localize(c.competency, lang)

  return (
    <div className="classroom-page gb-shell relative flex min-h-screen flex-col bg-cream">
      <header className="classroom-header flex items-center justify-between gap-3">
        <button className="classroom-exit gb-chip bg-white" onClick={onExit}>
          <span aria-hidden="true">&larr;</span>
          {tt('common.exit')}
        </button>
        <OnlineBadge online={online} className="classroom-online" />
      </header>

      <div className="classroom-heading">
        <RefBadge refId={c.ref} domain={tt(`domain.${c.domain}`)} />
        <h1 className="classroom-title font-display font-extrabold leading-tight">{lessonTitle}</h1>
        {lessonSupport && lessonSupport !== lessonTitle && (
          <p className="classroom-support font-bold text-ink/70">{lessonSupport}</p>
        )}
      </div>

      <nav className="classroom-tabs" role="tablist" aria-label="Lesson sections">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? 'is-active' : ''}
          >
            {tt(t.tkey)}
          </button>
        ))}
      </nav>

      <main
        className={`classroom-panel ${done ? 'classroom-results-panel' : ''} ${result === false ? 'answer-shake' : ''}`}
        role="tabpanel"
        aria-label={tt(TABS.find((entry) => entry.key === tab)?.tkey)}
      >
        {tab === 'explain' && (
          <section className="classroom-explanation">
            <div className="classroom-key-heading">
              <LightbulbIcon size={28} />
              <h2 className="font-display font-extrabold">Key idea</h2>
            </div>
            <p>{localize(teaching.explanation, lang)}</p>
          </section>
        )}

        {tab === 'example' && (
          <section className="classroom-example">
            {c.visual && (
              <div
                className="lesson-visual mb-4 overflow-hidden rounded-card bg-white p-3 text-ink"
                dangerouslySetInnerHTML={{ __html: c.visual }}
              />
            )}
            <QuestionVisual
              question={localize(teaching.example.prompt, lang)}
              assetKey={visualKeyForCompetency(c)}
              dark
              className="mb-4"
            />
            <div className="rounded-card border-2 border-cream/60 bg-white/10 p-3">
              <p className="font-display text-lg font-bold leading-relaxed">{localize(teaching.example.prompt, lang)}</p>
              <ol className="mt-3 grid gap-2">
                {teaching.example.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2 text-base leading-relaxed">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow font-extrabold text-ink">
                      {stepIndex + 1}
                    </span>
                    <span>{localize(step, lang)}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded-card bg-mint p-3 font-display text-lg font-extrabold text-ink">
                {localize(teaching.example.answer, lang)}
              </p>
            </div>
          </section>
        )}

        {tab === 'practice' &&
          (done ? (
            <Summary answers={answers} correctCount={completionCorrectCount} total={c.items.length} lang={lang} />
          ) : (
            <section className="classroom-practice">
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

              <div className="classroom-question-meta">
                <p>{tt('common.question')} {idx + 1} / {c.items.length}</p>
                <span
                  className="classroom-question-progress"
                  role="progressbar"
                  aria-label={`${tt('common.question')} ${idx + 1} / ${c.items.length}`}
                  aria-valuemin="1"
                  aria-valuemax={c.items.length}
                  aria-valuenow={idx + 1}
                >
                  {Array.from({ length: c.items.length }, (_, dotIndex) => (
                    <span key={dotIndex} className={dotIndex <= idx ? 'is-complete' : ''} aria-hidden="true" />
                  ))}
                </span>
              </div>

              <p className="classroom-question-text font-display">{localize(item.q, lang)}</p>
              <QuestionVisual question={localize(item.q, lang)} dark />

              {item.steps?.length > 0 && !stepsDone && (
                <div className="mt-3 rounded-card border-2 border-cream/50 bg-white/10 p-3">
                  <p className="text-sm font-extrabold text-cream">{tt('class.steps')}</p>
                </div>
              )}
            </section>
          ))}
      </main>

      {tab === 'practice' && !done && stepsDone && (
        <section className="classroom-answer-card" aria-label={itemOptions ? tt('class.pickAnswer') : answerHint(lang)}>
          <p className="classroom-answer-heading">{itemOptions ? tt('class.pickAnswer') : answerHint(lang)}</p>
          {itemOptions ? (
            <div className="classroom-choice-list" role="radiogroup" aria-label={tt('class.pickAnswer')}>
              {itemOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={input === opt}
                  disabled={result !== null}
                  onClick={() => {
                    if (result === null) {
                      setInput(opt)
                      setNudge(null)
                    }
                  }}
                  className={input === opt ? 'is-selected' : ''}
                >
                  <span className="classroom-choice-radio" aria-hidden="true" />
                  <span className="classroom-choice-content">
                    <ChoiceVisual value={opt} />
                    <span>{localizeChoice(opt, lang)}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (nudge) setNudge(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
              disabled={result !== null}
              placeholder={tt('common.answerPlaceholder')}
              inputMode="decimal"
              pattern="[0-9.]*"
              type="text"
              className="classroom-answer-input"
            />
          )}
          {nudge && <p className="classroom-answer-nudge">{tt('common.' + nudge)}</p>}
        </section>
      )}

      <section className="classroom-tutor">
        <div className={`classroom-mascot ${avatarState}`}>
          <Mascot size={104} />
        </div>
        <div className="classroom-tutor-bubble">
          <SpeechBubble speaking>
            {done ? bubble : result !== null && item.solution ? localize(item.solution, lang) : result === false ? tt('classroom.tryAgain') : bubble}
          </SpeechBubble>
        </div>
      </section>

      {showCorrectOverlay && (
        <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-mint/90 px-6 text-center">
          <p className="nova-correct font-display text-5xl font-extrabold text-ink">{tt('classroom.correctOverlay')}</p>
        </div>
      )}

      {isSpeechSupported() && (
        <div className="classroom-voice-controls">
          <button
            className="classroom-voice-action"
            onClick={() => {
              setPaused(false)
              speak(bubble, { lang })
            }}
            aria-label={tt('class.listenAgain')}
            title={tt('class.listenAgain')}
          >
            <span className="classroom-control-icon"><EarIcon size={26} /></span>
            <span>{tt('class.listenAgain')}</span>
          </button>
          <button
            className="classroom-voice-action"
            onClick={togglePause}
            aria-label={paused ? tt('class.play') : tt('class.pause')}
            title={paused ? tt('class.play') : tt('class.pause')}
          >
            <span className="classroom-control-icon">
              {paused ? <PlayCircleIcon size={28} /> : <PauseCircleIcon size={28} />}
            </span>
            <span>{paused ? tt('class.play') : tt('class.pause')}</span>
          </button>
          <button
            className="classroom-ask-teacher bg-lavender"
            onClick={() => setAskOpen((v) => !v)}
            aria-expanded={askOpen}
            aria-label={tt('class.raiseHand')}
            title={tt('class.raiseHand')}
          >
            <RaiseHandIcon size={28} />
            <span>{tt('class.raiseHand')}</span>
          </button>
        </div>
      )}

      {askOpen && (
        <div className="classroom-ask-panel gb-card bg-white gb-pop">
          <div className="classroom-ask-row flex items-center gap-2">
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
          {transcribing && <p className="mt-2 text-sm font-bold text-ink/60">{tt('class.listening')}</p>}
          {!online && <p className="mt-2 text-sm text-ink/60">{tt('class.offlineNote')}</p>}
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

      {answered && (
        <div className={`classroom-mastery ${done ? 'is-results' : ''}`}>
          <div className="classroom-mastery-heading">
            <span>{tt('common.mastery')}</span>
            <strong>{Math.round((score ?? 0) * 100)}%</strong>
          </div>
          <MasteryBar score={score} />
        </div>
      )}

      <div className="classroom-actions">
        {tab !== 'practice' ? (
          <Button color="yellow" className="classroom-start-practice w-full" onClick={() => setTab('practice')}>
            {tt('class.startPractice')} &rarr;
          </Button>
        ) : done ? (
          <div className="classroom-results-actions">
            <Button color="white" className="flex-1 text-lg" onClick={restart}>{tt('class.repeat')}</Button>
            <Button color="mint" className="flex-1 text-lg" onClick={onExit}>{tt('common.done')}</Button>
          </div>
        ) : !stepsDone ? (
          <StepScaffold item={item} lang={lang} tt={tt} onComplete={() => setStepsDone(true)} />
        ) : result === null ? (
          <Button
            color="yellow"
            className="classroom-submit-answer w-full disabled:opacity-50"
            onClick={submit}
            disabled={!input.trim()}
          >
            {tt('class.answer')} &rarr;
          </Button>
        ) : feedbackReady ? (
          result ? (
            <Button ref={actionRef} color="sky" className="classroom-submit-answer w-full" onClick={next}>
              {idx + 1 >= c.items.length ? tt('common.finish') : tt('common.next')} &rarr;
            </Button>
          ) : (
            <Button ref={actionRef} color="rose" className="classroom-submit-answer w-full" onClick={tryAgain}>
              {tt('classroom.retry')}
            </Button>
          )
        ) : (
          <span className="classroom-read-solution gb-chip bg-yellow">{tt('classroom.readSolution')}</span>
        )}
      </div>
    </div>
  )
}

// Shared lesson-completion summary. Uses the existing session answer log so every
// lesson and question count renders the same responsive results layout.
function Summary({ answers, correctCount, total, lang = 'taglish' }) {
  const tt = makeT(lang)
  const incorrectAnswers = uniqueIncorrectAnswers(answers)
  const incorrectCount = Math.max(0, total - correctCount)
  return (
    <div className="classroom-results">
      <section className="classroom-results-hero">
        <span className="classroom-results-check" aria-hidden="true">&#10003;</span>
        <div className="classroom-results-score">
          <h2>{tt('summary.done')}</h2>
          <p>{tt('summary.scoreLine', { correct: correctCount, total })}</p>
          <div className="classroom-results-counts">
            <span className="bg-mint">{tt('common.correct')}: {correctCount}</span>
            <span className="bg-rose">{tt('common.wrong')}: {incorrectCount}</span>
          </div>
        </div>
      </section>

      <div className="classroom-results-review-heading">
        <h3>{tt('class.reviewMissed')}</h3>
      </div>

      <div className="classroom-results-list">
        {incorrectAnswers.map((answer, answerIndex) => (
          <article key={answerIndex} className="classroom-result-card">
            <div className="classroom-result-question">
              <span className="classroom-result-number">{answerIndex + 1}</span>
              <p>{answer.q}</p>
            </div>
            <div className="classroom-result-comparison">
              <div>
                <span>{tt('common.yourAnswer')}</span>
                <strong className={answer.correct ? 'is-correct' : 'is-wrong'}>
                  {answer.your ? localizeChoice(answer.your, lang) : '—'}
                </strong>
              </div>
              <div>
                <span>{tt('common.correctAnswer')}</span>
                <strong className="is-correct">{localizeChoice(answer.answer, lang)}</strong>
              </div>
            </div>
            {answer.solution && (
              <div className="classroom-result-explanation">
                <span>{tt('common.explanation')}</span>
                <RichText>{answer.solution}</RichText>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}