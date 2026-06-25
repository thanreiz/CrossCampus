import { useMemo, useState } from 'react'
import { Card, Chip, Doodles, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { masteryLabel } from '../lib/mastery.js'

const TITLES = {
  'G6-NA-PERCENT-01': 'Percent, Fractions & Decimals',
  'G6-NA-PERCENT-02': 'Percentage, Rate & Base',
  'G6-NA-PERCENT-03': 'Percent & Discounts',
  'G6-NA-RATIO-01': 'Ratio & Proportion',
  'G6-NA-DEC-01': 'Decimal Operations',
  'G6-NA-GCFLCM-01': 'GCF & LCM',
}
const ICONS = {
  'G6-NA-PERCENT-01': '%',
  'G6-NA-PERCENT-02': 'R',
  'G6-NA-PERCENT-03': 'SALE',
  'G6-NA-RATIO-01': ':',
  'G6-NA-DEC-01': '0.1',
  'G6-NA-GCFLCM-01': 'x',
}
const ICON_BG = ['bg-mint', 'bg-sky', 'bg-rose', 'bg-peach', 'bg-yellow', 'bg-lavender']

// Topic picker - design basis: Stitch "Gabay - Topic Picker".
export default function TopicPicker({ competencies, mastery, online = true, onPick, onBack }) {
  const domains = useMemo(
    () => ['Lahat', ...Array.from(new Set(competencies.map((c) => c.domain)))],
    [competencies],
  )
  const [filter, setFilter] = useState('Lahat')
  const shown = competencies.filter((c) => filter === 'Lahat' || c.domain === filter)

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />

      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <button className="gb-chip bg-white" onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-2">
          <OnlineBadge online={online} />
          <Mascot size={36} />
          <span className="font-display text-xl font-extrabold">Gabay</span>
        </div>
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight">
        Anong aaralin natin ngayon?
      </h1>
      <p className="mb-4 text-sm text-ink/70">Pumili ng topic at magsimula ng practice.</p>

      {/* filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {domains.map((d) => (
          <Chip key={d} color="lavender" active={filter === d} onClick={() => setFilter(d)}>
            {d === 'Number and Algebra' ? 'Number & Algebra' : d}
          </Chip>
        ))}
      </div>

      {/* topic cards */}
      <div className="flex flex-col gap-4">
        {shown.map((c, i) => {
          const score = mastery[c.ref] ?? 0.5
          const pct = Math.round(score * 100)
          return (
            <Card
              key={c.ref}
              className="gb-pop cursor-pointer p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
              role="button"
              tabIndex={0}
              onClick={() => onPick(c)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-outline ${ICON_BG[i % ICON_BG.length]} text-2xl font-extrabold`}
                >
                  {ICONS[c.ref] ?? '+'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-bold leading-tight">
                      {TITLES[c.ref] ?? c.competency}
                    </h2>
                    <span className="gb-chip bg-yellow shadow-hard-sm shrink-0 text-[10px]">
                      {masteryLabel(score)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink/70">{c.competency}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <MasteryBar score={score} />
                    <span className="whitespace-nowrap text-xs font-bold">{pct}%</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


