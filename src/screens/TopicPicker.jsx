import { useMemo, useState } from 'react'
import { Card, Chip, Doodles, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { masteryColor } from '../lib/mastery.js'
import { topicTitle, topicIcon } from '../lib/topics.js'
import { makeT } from '../lib/i18n.js'

const ICON_BG = ['bg-mint', 'bg-sky', 'bg-rose', 'bg-peach', 'bg-yellow', 'bg-lavender']
const ALL = '__all__'

// Topic picker - design basis: Stitch "Gabay - Topic Picker".
export default function TopicPicker({ competencies, mastery, online = true, lang = 'taglish', onPick, onBack }) {
  const tt = makeT(lang)
  const domains = useMemo(
    () => [ALL, ...Array.from(new Set(competencies.map((c) => c.domain)))],
    [competencies],
  )
  const [filter, setFilter] = useState(ALL)
  const shown = competencies.filter((c) => filter === ALL || c.domain === filter)

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />

      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <button className="gb-chip bg-white" onClick={onBack}>
          {tt('common.back')}
        </button>
        <div className="flex items-center gap-2">
          <OnlineBadge online={online} />
          <Mascot size={36} />
          <span className="font-display text-xl font-extrabold">Gabay</span>
        </div>
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight">
        {tt('topics.heading')}
      </h1>
      <p className="mb-4 text-base font-bold text-ink/70">{tt('topics.sub')}</p>

      {/* filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {domains.map((d) => (
          <Chip key={d} color="lavender" active={filter === d} onClick={() => setFilter(d)}>
            {d === ALL ? tt('topics.all') : d === 'Number and Algebra' ? 'Number & Algebra' : d}
          </Chip>
        ))}
      </div>

      {/* topic cards */}
      <div className="flex flex-col gap-4">
        {shown.map((c, i) => {
          const score = mastery[c.ref] ?? 0.5
          const pct = Math.round(score * 100)
          const color = masteryColor(score)
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
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-outline ${ICON_BG[i % ICON_BG.length]} text-2xl font-extrabold`}
                >
                  {topicIcon(c.ref)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg font-bold leading-tight">
                      {topicTitle(c.ref, c.competency)}
                    </h2>
                    <span className={`gb-chip ${color.bg} shadow-hard-sm shrink-0 text-[11px]`}>
                      {tt('band.' + color.band)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/70">{c.competency}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <MasteryBar score={score} />
                    <span className="whitespace-nowrap text-sm font-extrabold">{pct}%</span>
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


