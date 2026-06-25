import { Card, Doodles, RefBadge, MasteryBar, Button } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import { masteryLabel } from '../lib/mastery.js'

// "Aking Progreso" — per-competency mastery overview.
export default function Progress({ competencies, mastery, next, onPick, onBack }) {
  const scores = competencies.map((c) => mastery[c.ref] ?? 0.5)
  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />

      <div className="mb-4 flex items-center gap-3">
        <Mascot size={64} />
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none">Aking Progreso</h1>
          <p className="text-sm text-ink/70">Average mastery: {Math.round(avg * 100)}%</p>
        </div>
      </div>

      {next && (
        <Card color="yellow" className="gb-pop mb-5 p-4">
          <p className="font-bold">⭐ Susunod na dapat pag-aralan:</p>
          <p className="mt-1 text-sm">{next.competency}</p>
          <Button color="white" className="mt-3 w-full" onClick={() => onPick(next)}>
            Simulan →
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {competencies.map((c) => {
          const s = mastery[c.ref] ?? 0.5
          return (
            <Card
              key={c.ref}
              className="cursor-pointer p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
              role="button"
              tabIndex={0}
              onClick={() => onPick(c)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}
            >
              <div className="flex items-center justify-between gap-2">
                <RefBadge refId={c.ref} domain={c.domain} />
                <span className="text-xs font-bold">{masteryLabel(s)}</span>
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">{c.competency}</p>
              <div className="mt-2">
                <MasteryBar score={s} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
