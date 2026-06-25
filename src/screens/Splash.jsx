import { useEffect } from 'react'
import { Mascot } from '../ui/Mascot.jsx'
import { Button, Doodles } from '../ui/Primitives.jsx'

export default function Splash({ onStart }) {
  // Auto-advance after a beat, but let the user tap too.
  useEffect(() => {
    const t = setTimeout(onStart, 2600)
    return () => clearTimeout(t)
  }, [onStart])

  return (
    <div className="gb-shell flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Doodles />
      <Mascot size={150} float className="mb-2" />
      <h1 className="font-display text-6xl font-extrabold tracking-tight">Gabay</h1>
      <p className="mt-2 font-display text-lg font-bold text-ink/80">
        Ang iyong study buddy sa Math 📚
      </p>
      <p className="mt-1 text-sm text-ink/60">Grade 6 · DepEd MATATAG · gumagana kahit walang signal</p>
      <Button color="mint" className="mt-8 text-lg" onClick={onStart}>
        Magsimula →
      </Button>
    </div>
  )
}
