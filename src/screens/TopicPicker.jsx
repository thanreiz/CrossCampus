import { useMemo, useState } from 'react'
import { Card, Chip, Doodles, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { masteryLabel } from '../lib/mastery.js'

// Topic picker — grouped by MATATAG domain, with filter chips.
export default function TopicPicker({ competencies, mastery, onPick, onBack }) {
  const domains = useMemo(
    () => ['Lahat', ...Array.from(new Set(competencies.map((c) => c.domain)))],
    [competencies],
  )
  const [filter, setFilter] = useState('Lahat')

  const shown = competencies.filter((c) => filter === 'Lahat' || c.domain === filter)

  // group shown by domain for the headers
  const groups = shown.reduce((acc, c) => {
    ;(acc[c.domain] ??= []).push(c)
    return acc
  }, {})

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-10 pt-6">
      <Doodles />
      <button className="mb-4 self-start gb-chip bg-white" onClick={onBack}>
        ← Balik
      </button>
      <h1 className="font-display text-3xl font-extrabold">Mga Aralin</h1>
      <p className="mb-3 text-sm text-ink/70">Pumili ng competency na pag-aaralan.</p>

      <div className="mb-5 flex flex-wrap gap-2">
        {domains.map((d) => (
          <Chip key={d} color="lavender" active={filter === d} onClick={() => setFilter(d)}>
            {d === 'Number and Algebra' ? 'Number & Algebra' : d}
          </Chip>
        ))}
      </div>

      {Object.entries(groups).map(([domain, items]) => (
        <section key={domain} className="mb-6">
          <h2 className="mb-2 font-display text-lg font-bold text-ink/80">{domain}</h2>
          <div className="flex flex-col gap-3">
            {items.map((c) => {
              const score = mastery[c.ref] ?? 0.5
              return (
                <Card
                  key={c.ref}
                  className="gb-pop cursor-pointer p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
                  role="button"
                  tabIndex={0}
                  onClick={() => onPick(c)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}
                >
                  <RefBadge refId={c.ref} domain={c.domain} />
                  <p className="mt-2 font-bold leading-snug">{c.competency}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <MasteryBar score={score} />
                    <span className="whitespace-nowrap text-xs font-bold">
                      {masteryLabel(score)}
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
