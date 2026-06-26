import { useEffect, useRef, useState } from 'react'
import { buildClassroom, THEME_LIST } from '../three/scene.js'
import { Button, RefBadge, RichText } from '../ui/Primitives.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer } from '../lib/check.js'
import { speak, stopSpeaking } from '../lib/speech.js'
import { feedbackFor } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicFull } from '../lib/topics.js'
import { loadTheme, saveTheme, DEFAULT_THEME } from '../lib/theme.js'
import { makeT, localize } from '../lib/i18n.js'
import { answerHint } from '../lib/lang.js'
import { sfx, primeAudio } from '../lib/sound.js'

// Strip **bold** markup before reading aloud.
function plain(s) {
  return String(s ?? '').replace(/\*\*/g, '')
}

// Embed harness: hosts codex's Three.js classroom inside React.
// React owns the DOM shell + lesson modal + content/mastery/voice bridge.
// Three.js owns the canvas. The whole scene lives in three/scene.js -> buildClassroom(),
// so codex's richer geometry can replace that one function without touching this file.
export default function Classroom3D({ competency, score, online, lang = 'taglish', onAnswered, onExit }) {
  const c = competency
  const tt = makeT(lang)
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  const [ready, setReady] = useState(false)
  const [atBoard, setAtBoard] = useState(false)
  const [modal, setModal] = useState(false)
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [fb, setFb] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [themeOpen, setThemeOpen] = useState(false)
  const [nudge, setNudge] = useState(null) // 'needAnswer' | 'needNumber' | null — gentle input validation
  const [showIntro, setShowIntro] = useState(true) // first-entry coachmark (how to answer)

  const item = c.items[idx]
  const itemRef = useRef(item)

  useEffect(() => {
    itemRef.current = item
  }, [item])

  // Boot the Three.js scene once.
  useEffect(() => {
    if (!mountRef.current) return
    const api = buildClassroom({
      mount: mountRef.current,
      competency: c,
      boardText: localize(c.items?.[0]?.q, lang),
      labels: { correct: tt('3d.board.correct'), tryAgain: tt('3d.board.tryAgain'), ready: tt('3d.board.ready') },
      // fired when the player walks into the blackboard zone
      onNearBoard: (near) => setAtBoard(near),
      onInteract: () => openBoard(),
    })
    sceneRef.current = api
    setReady(true)
    return () => {
      stopSpeaking()
      api.dispose()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Teacher greeting on entry (voice-out, offline-safe).
  useEffect(() => {
    if (ready) speak(tt('class.welcome3d'), { lang })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Load the saved "renovation" theme, then apply it once the scene is live.
  useEffect(() => {
    loadTheme().then(setTheme)
  }, [])
  useEffect(() => {
    if (ready) sceneRef.current?.setTheme(theme)
  }, [ready, theme])

  function changeTheme(key) {
    setTheme(key)
    saveTheme(key)
    sceneRef.current?.setTheme(key)
  }

  function openBoard() {
    primeAudio() // tapping the board is a user gesture — unlock audio here too
    sceneRef.current?.setControls(false) // release pointer lock while answering
    setModal(true)
    speak(localize(itemRef.current.q, lang), { lang })
  }

  function submit() {
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
    setAnswers((a) => [...a, { q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, solution: locItem.solution }])
    recordAttempt({ ref: c.ref, q: locItem.q, your: input.trim(), answer: item.answer, correct: ok, feedback: ok ? f.headline : f.body })
    onAnswered(c.ref, ok)
    speak(ok ? f.headline : `${f.headline} ${plain(f.body)}`, { lang })
    sceneRef.current?.markBoard(ok)
  }

  function next() {
    if (idx + 1 >= c.items.length) {
      setDone(true)
      setModal(false)
      sfx('finish')
      speak(tt('class.bubble.done', { correct: correctCount, total: c.items.length }), { lang })
      return
    }
    const n = idx + 1
    setIdx(n)
    setInput('')
    setResult(null)
    setFb(null)
    setNudge(null)
    sceneRef.current?.setBoardText(localize(c.items[n].q, lang))
    speak(localize(c.items[n].q, lang), { lang })
  }

  function closeModal() {
    setModal(false)
    setResult(null)
    setFb(null)
    setNudge(null)
    sceneRef.current?.setControls(true)
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#27433b]">
      {/* Three.js canvas mounts here */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* top HUD */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3">
        <button className="pointer-events-auto gb-chip bg-white" onClick={onExit}>{tt('common.exit')}</button>
        <div className="pointer-events-auto flex items-center gap-2">
          <OnlineBadge online={online} />
          <RefBadge refId={c.ref} domain={c.domain} />
        </div>
      </div>


      {/* full child-friendly topic title */}
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 px-2 text-center">
        <span className="gb-chip bg-white/90 text-xs">{topicFull(c.ref, c.competency)}</span>
      </div>

      <div className="absolute right-3 top-20 grid gap-2">
        <button
          className="gb-chip min-h-[44px] min-w-[44px] bg-white text-xl shadow-hard-sm"
          onClick={() => sceneRef.current?.zoom(-8)}
          aria-label={tt('3d.zoomIn')}
        >
          +
        </button>
        <button
          className="gb-chip min-h-[44px] min-w-[44px] bg-white text-xl shadow-hard-sm"
          onClick={() => sceneRef.current?.zoom(8)}
          aria-label={tt('3d.zoomOut')}
        >
          -
        </button>
        {/* renovation / theme switcher */}
        <button
          className="gb-chip min-h-[44px] min-w-[44px] bg-lavender text-base shadow-hard-sm"
          onClick={() => setThemeOpen((v) => !v)}
          aria-label={tt('3d.changeRoom')}
          title={tt('3d.changeRoom')}
        >
          {tt('3d.theme')}
        </button>
        {themeOpen && (
          <div className="gb-card gb-pop w-36 bg-white p-2">
            <p className="mb-1 px-1 text-xs font-extrabold text-ink/60">{tt('3d.changeRoom')}</p>
            <div className="grid gap-1.5">
              {THEME_LIST.map((t) => (
                <button
                  key={t.key}
                  onClick={() => changeTheme(t.key)}
                  className={`rounded-full border-2 border-outline px-3 py-1.5 text-sm font-bold ${
                    theme === t.key ? 'bg-yellow' : 'bg-white'
                  }`}
                >
                  {tt('theme.' + t.key)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* hint */}
      {ready && !modal && !done && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 text-center">
          <p className="gb-chip bg-yellow shadow-hard-sm">
            {atBoard ? tt('3d.hintAtBoard') : tt('3d.hintMove')}
          </p>
        </div>
      )}

      {/* on-screen joystick — easy movement on touch (and mouse) */}
      {ready && !modal && !done && (
        <Joystick onMove={(x, y) => sceneRef.current?.setMove(x, y)} />
      )}

      {/* answer trigger when near board */}
      {ready && atBoard && !modal && !done && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Button color="mint" className="min-h-[56px] px-8 text-xl" onClick={openBoard}>
            {tt('3d.answerBoard')}
          </Button>
        </div>
      )}

      {/* look hint (right side) — drag the right half of the screen to look around */}
      {ready && !modal && (
        <div className="pointer-events-none absolute bottom-8 right-6 max-w-[120px] text-right text-xs font-bold text-cream/70">
          {tt('3d.lookHint')}
        </div>
      )}

      {/* done card — score summary with correct/wrong + explanations */}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="gb-card bg-white gb-pop my-auto max-h-[90vh] w-full max-w-sm overflow-y-auto p-5 text-center">
            <p className="font-display text-2xl font-extrabold">{tt('summary.done')}</p>
            <p className="mt-1 text-lg font-bold">
              {tt('summary.scoreLine', { correct: correctCount, total: c.items.length })}
            </p>
            <div className="mt-2 flex justify-center gap-2 text-sm font-bold">
              <span className="gb-chip bg-mint">{tt('common.correct')}: {correctCount}</span>
              <span className="gb-chip bg-rose">{tt('common.wrong')}: {c.items.length - correctCount}</span>
            </div>
            {answers.some((a) => !a.correct) && (
              <div className="mt-4 text-left">
                <p className="mb-2 text-sm font-extrabold text-ink/70">{tt('class.reviewMissed')}</p>
                <div className="flex flex-col gap-2">
                  {answers.filter((a) => !a.correct).map((a, i) => (
                    <div key={i} className="rounded-card border-2 border-outline bg-cream p-3 text-sm">
                      <p className="font-bold"><span className="text-ink/60">{tt('common.question')}:</span> {a.q}</p>
                      <p className="mt-1 font-bold"><span className="text-ink/60">{tt('common.yourAnswer')}:</span> <span className="text-rose-700">{a.your || '—'}</span></p>
                      <p className="mt-1 font-bold"><span className="text-ink/60">{tt('common.correctAnswer')}:</span> <span className="text-green-700">{a.answer}</span></p>
                      {a.solution && <p className="mt-1"><span className="font-bold text-ink/60">{tt('common.explanation')}:</span> <RichText>{a.solution}</RichText></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button color="mint" className="mt-4 w-full text-lg" onClick={onExit}>{tt('common.done')}</Button>
          </div>
        </div>
      )}

      {/* first-entry coachmark — explicit "how to answer" for first-time kids */}
      {ready && showIntro && !done && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
          <div className="gb-card gb-pop w-full max-w-sm bg-white p-6 text-center">
            <h2 className="font-display text-2xl font-extrabold">{tt('3d.intro.title')}</h2>
            <ol className="mt-4 flex flex-col gap-3 text-left">
              {['3d.intro.s1', '3d.intro.s2', '3d.intro.s3'].map((k, i) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="gb-chip bg-yellow shadow-hard-sm h-7 w-7 justify-center p-0 text-sm font-extrabold leading-none tabular-nums">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm font-bold leading-snug">{tt(k)}</span>
                </li>
              ))}
            </ol>
            <Button color="mint" className="mt-5 w-full text-lg" onClick={() => setShowIntro(false)}>
              {tt('3d.intro.go')}
            </Button>
          </div>
        </div>
      )}

      {/* lesson modal - reuses content items + auto-check + mastery + voice */}
      {modal && !done && (
        <div className="absolute inset-0 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="gb-card bg-white gb-pop w-full max-w-md p-5 sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-ink/60">
                {tt('common.question')} {idx + 1} / {c.items.length}
              </span>
              <button className="gb-chip min-h-[44px] min-w-[44px] bg-white text-lg" onClick={closeModal} aria-label={tt('common.exit')}>x</button>
            </div>
            {/* immediate feedback at the top of the question */}
            {result !== null && fb && (
              <div className={`mb-3 rounded-card border-2 border-outline p-3 ${fb.ok ? 'bg-mint' : 'bg-yellow'}`}>
                <p className="font-display text-lg font-extrabold">{fb.headline}</p>
                {!fb.ok && (
                  <p className="mt-1 text-sm font-bold leading-snug">
                    <RichText>{fb.body}</RichText>
                  </p>
                )}
              </div>
            )}

            <p className="font-display text-2xl font-bold leading-snug">{localize(item.q, lang)}</p>

            {item.type === 'mcq' && item.options && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setInput(opt)
                      setNudge(null)
                    }}
                    className={`gb-chip ${input === opt ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* explicit instruction — kids need to know where to put the answer */}
            <p className="mt-4 px-1 text-sm font-bold text-ink/70">
              {item.type === 'mcq' ? tt('class.pickAnswer') : tt('class.typeHere')}
            </p>
            {item.type !== 'mcq' && (
              <p className="px-1 text-xs font-bold text-ink/50">{answerHint(lang)}</p>
            )}

            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
              {item.type !== 'mcq' && (
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    if (nudge) setNudge(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
                  placeholder={tt('common.answerPlaceholder')}
                  inputMode="decimal"
                  className="min-h-[56px] min-w-0 rounded-full border-[2.5px] border-outline px-5 py-3 text-lg font-bold outline-none focus:bg-cream"
                />
              )}
              {result === null ? (
                <Button
                  color="mint"
                  className={`min-h-[56px] px-6 text-lg disabled:opacity-50 ${item.type === 'mcq' ? 'w-full' : ''}`}
                  onClick={submit}
                  disabled={!input.trim()}
                >
                  {tt('class.answer')}
                </Button>
              ) : (
                <Button color="sky" className={`min-h-[56px] px-6 text-lg ${item.type === 'mcq' ? 'w-full' : ''}`} onClick={next}>
                  {idx + 1 >= c.items.length ? tt('common.finish') : tt('common.next')}
                </Button>
              )}
            </div>

            {nudge && (
              <p className="mt-2 px-1 text-sm font-extrabold text-[#c0414b]">{tt('common.' + nudge)}</p>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

// On-screen thumbstick. Pointer (touch or mouse) drags the knob; the normalized
// offset (-1..1 on each axis) is fed to the Three.js scene via setMove().
function Joystick({ onMove }) {
  const baseRef = useRef(null)
  const activeRef = useRef(false)
  const [thumb, setThumb] = useState({ x: 0, y: 0 })

  function track(e) {
    const el = baseRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const max = r.width / 2
    let dx = e.clientX - cx
    let dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > max) {
      dx = (dx / dist) * max
      dy = (dy / dist) * max
    }
    setThumb({ x: dx, y: dy })
    onMove(dx / max, dy / max)
  }

  function start(e) {
    activeRef.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    track(e)
  }
  function move(e) {
    if (activeRef.current) track(e)
  }
  function end() {
    activeRef.current = false
    setThumb({ x: 0, y: 0 })
    onMove(0, 0)
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Joystick — galaw"
      className="pointer-events-auto absolute bottom-8 left-6 h-32 w-32 touch-none select-none rounded-full border-[2.5px] border-outline bg-white/30 backdrop-blur-sm"
    >
      <span
        className="absolute left-1/2 top-1/2 h-16 w-16 rounded-full border-[2.5px] border-outline bg-yellow shadow-hard-sm"
        style={{ transform: `translate(-50%, -50%) translate(${thumb.x}px, ${thumb.y}px)` }}
      />
    </div>
  )
}








