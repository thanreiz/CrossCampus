import { useEffect, useRef, useState } from 'react'
import { buildClassroom } from '../three/scene.js'
import { Button, RefBadge } from '../ui/Primitives.jsx'
import { checkAnswer } from '../lib/check.js'
import { speak, stopSpeaking } from '../lib/speech.js'

// Embed harness: hosts codex's Three.js classroom inside React.
// React owns the DOM shell + lesson modal + content/mastery/voice bridge.
// Three.js owns the canvas. The whole scene lives in three/scene.js -> buildClassroom(),
// so codex's richer geometry can replace that one function without touching this file.
export default function Classroom3D({ competency, score, online, onAnswered, onExit }) {
  const c = competency
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  const [ready, setReady] = useState(false)
  const [atBoard, setAtBoard] = useState(false)
  const [modal, setModal] = useState(false)
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

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
    if (ready) speak(`Maligayang pagdating sa klase! Lakad sa pisara para magsimula.`)
  }, [ready])

  function openBoard() {
    sceneRef.current?.setControls(false) // release pointer lock while answering
    setModal(true)
    speak(itemRef.current.q)
  }

  function submit() {
    if (result !== null) return
    const ok = checkAnswer(item, input)
    setResult(ok)
    if (ok) setCorrectCount((n) => n + 1)
    onAnswered(c.ref, ok)
    speak(ok ? 'Tama!' : `Halos. Ang sagot ay ${item.answer}.`)
    sceneRef.current?.markBoard(ok)
  }

  function next() {
    if (idx + 1 >= c.items.length) {
      setDone(true)
      setModal(false)
      speak(`Tapos na! ${correctCount} sa ${c.items.length} tama.`)
      return
    }
    const n = idx + 1
    setIdx(n)
    setInput('')
    setResult(null)
    sceneRef.current?.setBoardText(c.items[n].q)
    speak(c.items[n].q)
  }

  function closeModal() {
    setModal(false)
    setResult(null)
    sceneRef.current?.setControls(true)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#27433b]">
      {/* Three.js canvas mounts here */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* top HUD */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-3">
        <button className="pointer-events-auto gb-chip bg-white" onClick={onExit}>Exit</button>
        <div className="pointer-events-auto">
          <RefBadge refId={c.ref} domain={c.domain} />
        </div>
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
      </div>
      {/* hint */}
      {ready && !modal && !done && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 text-center">
          <p className="gb-chip bg-yellow shadow-hard-sm">
            {atBoard ? 'Tap Sagutin or press E / F' : 'WASD move · Shift sprint · Ctrl crouch · Space jump · scroll zoom'}
          </p>
        </div>
      )}

      {/* answer trigger when near board */}
      {ready && atBoard && !modal && !done && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Button color="mint" className="min-h-[56px] px-8 text-xl" onClick={openBoard}>
            Sagutin
          </Button>
        </div>
      )}

      {/* mobile joystick zone (left) - scene reads pointer events on the canvas;
          this badge just tells the user. Desktop uses pointer-lock on click. */}
      {ready && !modal && (
        <div className="pointer-events-none absolute bottom-6 left-4 text-xs text-cream/70">
          Touch: left drag moves · right drag looks · pinch not needed
        </div>
      )}

      {/* done card */}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="gb-card bg-white gb-pop max-w-xs p-6 text-center">
            <p className="font-display text-2xl font-extrabold">Tapos na!</p>
            <p className="mt-2 text-lg">
              {correctCount} / {c.items.length} tama
            </p>
            <Button color="mint" className="mt-4 w-full" onClick={onExit}>Tapos</Button>
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

            {result !== null && (
              <p className={`mt-3 font-bold ${result ? 'text-green-700' : 'text-rose-700'}`}>
                {result ? 'Tama!' : `Halos! Sagot: ${item.answer}`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}





