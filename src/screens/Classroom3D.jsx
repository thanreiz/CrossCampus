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
    if (ready) speak(`Maligayang pagdating sa klase! Lakad sa pisara para magsimula.`, { lang })
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
    sceneRef.current?.setControls(false) // release pointer lock while answering
    setModal(true)
    speak(itemRef.current.q, { lang })
  }

  function submit() {
    if (result !== null) return
    const ok = checkAnswer(item, input)
    const f = feedbackFor(item, ok, lang, idx)
    setResult(ok)
    setFb(f)
    if (ok) setCorrectCount((n) => n + 1)
    setAnswers((a) => [...a, { q: item.q, your: input.trim(), answer: item.answer, correct: ok, solution: item.solution }])
    recordAttempt({ ref: c.ref, q: item.q, your: input.trim(), answer: item.answer, correct: ok, feedback: ok ? f.headline : f.body })
    onAnswered(c.ref, ok)
    speak(ok ? f.headline : `${f.headline} ${plain(f.body)}`, { lang })
    sceneRef.current?.markBoard(ok)
  }

  function next() {
    if (idx + 1 >= c.items.length) {
      setDone(true)
      setModal(false)
      speak(`Tapos na! ${correctCount} sa ${c.items.length} tama.`, { lang })
      return
    }
    const n = idx + 1
    setIdx(n)
    setInput('')
    setResult(null)
    setFb(null)
    sceneRef.current?.setBoardText(c.items[n].q)
    speak(c.items[n].q, { lang })
  }

  function closeModal() {
    setModal(false)
    setResult(null)
    setFb(null)
    sceneRef.current?.setControls(true)
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#27433b]">
      {/* Three.js canvas mounts here */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* top HUD */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3">
        <button className="pointer-events-auto gb-chip bg-white" onClick={onExit}>Exit</button>
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
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className="gb-chip min-h-[44px] min-w-[44px] bg-white text-xl shadow-hard-sm"
          onClick={() => sceneRef.current?.zoom(8)}
          aria-label="Zoom out"
        >
          -
        </button>
        {/* renovation / theme switcher */}
        <button
          className="gb-chip min-h-[44px] min-w-[44px] bg-lavender text-base shadow-hard-sm"
          onClick={() => setThemeOpen((v) => !v)}
          aria-label="Palitan ang klase"
          title="Palitan ang klase"
        >
          Tema
        </button>
        {themeOpen && (
          <div className="gb-card gb-pop w-36 bg-white p-2">
            <p className="mb-1 px-1 text-xs font-extrabold text-ink/60">Palitan ang klase</p>
            <div className="grid gap-1.5">
              {THEME_LIST.map((t) => (
                <button
                  key={t.key}
                  onClick={() => changeTheme(t.key)}
                  className={`rounded-full border-2 border-outline px-3 py-1.5 text-sm font-bold ${
                    theme === t.key ? 'bg-yellow' : 'bg-white'
                  }`}
                >
                  {t.name}
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
            {atBoard ? 'Tap Sagutin o pindutin ang E / F' : 'Joystick para gumalaw · WASD sa keyboard · scroll para mag-zoom'}
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
            Sagutin
          </Button>
        </div>
      )}

      {/* look hint (right side) — drag the right half of the screen to look around */}
      {ready && !modal && (
        <div className="pointer-events-none absolute bottom-8 right-6 max-w-[120px] text-right text-xs font-bold text-cream/70">
          I-drag ang kanang bahagi para tumingin sa paligid
        </div>
      )}

      {/* done card — score summary with correct/wrong + explanations */}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="gb-card bg-white gb-pop my-auto max-h-[90vh] w-full max-w-sm overflow-y-auto p-5 text-center">
            <p className="font-display text-2xl font-extrabold">Tapos na!</p>
            <p className="mt-1 text-lg font-bold">
              {correctCount} / {c.items.length} tama
            </p>
            <div className="mt-2 flex justify-center gap-2 text-sm font-bold">
              <span className="gb-chip bg-mint">Tama: {correctCount}</span>
              <span className="gb-chip bg-rose">Mali: {c.items.length - correctCount}</span>
            </div>
            {answers.some((a) => !a.correct) && (
              <div className="mt-4 text-left">
                <p className="mb-2 text-sm font-extrabold text-ink/70">Balikan ang mga namali:</p>
                <div className="flex flex-col gap-2">
                  {answers.filter((a) => !a.correct).map((a, i) => (
                    <div key={i} className="rounded-card border-2 border-outline bg-cream p-3 text-sm">
                      <p className="font-bold"><span className="text-ink/60">Tanong:</span> {a.q}</p>
                      <p className="mt-1 font-bold"><span className="text-ink/60">Sagot mo:</span> <span className="text-rose-700">{a.your || '—'}</span></p>
                      <p className="mt-1 font-bold"><span className="text-ink/60">Tamang sagot:</span> <span className="text-green-700">{a.answer}</span></p>
                      {a.solution && <p className="mt-1"><span className="font-bold text-ink/60">Paliwanag:</span> <RichText>{a.solution}</RichText></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button color="mint" className="mt-4 w-full text-lg" onClick={onExit}>Tapos</Button>
          </div>
        </div>
      )}

      {/* lesson modal - reuses content items + auto-check + mastery + voice */}
      {modal && !done && (
        <div className="absolute inset-0 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="gb-card bg-white gb-pop w-full max-w-md p-5 sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-ink/60">
                Tanong {idx + 1} / {c.items.length}
              </span>
              <button className="gb-chip min-h-[44px] min-w-[44px] bg-white text-lg" onClick={closeModal}>x</button>
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

            <p className="font-display text-2xl font-bold leading-snug">{item.q}</p>

            {item.type === 'mcq' && item.options && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setInput(opt)}
                    className={`gb-chip ${input === opt ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : next())}
                placeholder="Isulat ang sagot..."
                inputMode={item.type === 'mcq' ? 'text' : 'decimal'}
                className="min-h-[56px] min-w-0 rounded-full border-[2.5px] border-outline px-5 py-3 text-lg font-bold outline-none focus:bg-cream"
              />
              {result === null ? (
                <Button color="mint" className="min-h-[56px] px-6 text-lg" onClick={submit}>
                  Sumagot
                </Button>
              ) : (
                <Button color="sky" className="min-h-[56px] px-6 text-lg" onClick={next}>
                  {idx + 1 >= c.items.length ? 'Tapusin' : 'Susunod'}
                </Button>
              )}
            </div>

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








