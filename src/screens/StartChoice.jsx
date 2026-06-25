import { Card, Button, Doodles, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { masteryLabel } from '../lib/mastery.js'

// "Start choice": let Gabay pick the weakest topic, or browse yourself.
export default function StartChoice({ next, mastery, onAuto, onBrowse, onBack }) {
  const score = next ? mastery[next.ref] ?? 0.5 : 0.5
  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-10 pt-6">
      <Doodles />
      <button className="mb-4 self-start gb-chip bg-white" onClick={onBack}>
        ← Bahay
      </button>
      <h1 className="font-display text-3xl font-extrabold">Paano tayo magsisimula?</h1>
      <p className="mb-5 text-sm text-ink/70">Ako na ang pipili, o ikaw?</p>

      {next && (
        <Card color="mint" className="gb-pop mb-4 p-5">
          <p className="mb-2 font-display text-lg font-bold">⭐ Mungkahi ni Teacher Gabay</p>
          <RefBadge refId={next.ref} domain={next.domain} />
          <p className="mt-2 font-bold">{next.competency}</p>
          <div className="mt-3 flex items-center gap-2">
            <MasteryBar score={score} />
            <span className="whitespace-nowrap text-xs font-bold">{masteryLabel(score)}</span>
          </div>
          <Button color="yellow" className="mt-4 w-full" onClick={() => onAuto(next)}>
            Ano'ng susunod? Simulan →
          </Button>
        </Card>
      )}

      <Card color="sky" className="gb-pop p-5">
        <p className="mb-1 font-display text-lg font-bold">📚 Pumili ako ng topic</p>
        <p className="mb-3 text-sm text-ink/70">Hanapin sa lahat ng aralin.</p>
        <Button color="white" className="w-full" onClick={onBrowse}>
          Tingnan ang mga topic →
        </Button>
      </Card>
    </div>
  )
}
