import { Card, Button, Doodles, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import { masteryLabel } from '../lib/mastery.js'

// Friendly short titles per competency (the big flashcard headline in the design).
const TITLES = {
  'G6-NA-PERCENT-01': 'Percent, Fractions & Decimals',
  'G6-NA-PERCENT-02': 'Percentage, Rate & Base',
  'G6-NA-PERCENT-03': 'Percent & Discounts',
  'G6-NA-RATIO-01': 'Ratio & Proportion',
  'G6-NA-DEC-01': 'Decimal Operations',
  'G6-NA-GCFLCM-01': 'GCF & LCM',
}

// Lesson brief — design basis: Stitch "Gabay - Lesson View".
// header -> title card -> "Ang gagawin mo" -> progress -> stat tiles -> sticky 2D/3D entry.
export default function LessonBrief({ competency, score = 0.5, onEnter, onEnter3D, onBack }) {
  const c = competency
  const title = TITLES[c.ref] ?? c.competency
  const pct = Math.round((score ?? 0.5) * 100)

  const tasks = [
    `Intindihin ang aralin: ${c.competency.replace(/\.$/, '')}.`,
    'Sagutin ang mga tanong ni Teacher Gabay sa pisara.',
    'Magtanong kung may hindi malinaw - itaas ang kamay!',
  ]

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-10 pt-6">
      <Doodles />

      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <button className="gb-chip bg-white" onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-2">
          <Mascot size={36} />
          <span className="font-display text-xl font-extrabold">Gabay</span>
        </div>
      </div>

      {/* title card */}
      <Card color="cream" className="gb-pop p-5">
        <RefBadge refId={c.ref} domain={c.domain} />
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight">{title}</h1>
        <p className="mt-2 text-sm font-bold text-ink/70">{c.competency}</p>

        <div className="mt-3 rounded-card border-[2.5px] border-outline bg-white p-3 text-sm">
          <p className="font-bold text-ink/70">Content Standard</p>
          <p className="text-ink/80">{c.content_standard}</p>
        </div>
      </Card>

      {/* "Ang gagawin mo" */}
      <Card color="peach" className="gb-pop mt-4 p-5">
        <span className="gb-chip bg-white shadow-hard-sm text-xs">Ang gagawin mo</span>
        <ol className="mt-3 flex flex-col gap-2">
          {tasks.map((t, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="gb-chip bg-yellow shadow-hard-sm h-7 w-7 justify-center p-0">
                {i + 1}
              </span>
              <span className="pt-1 text-sm font-bold leading-snug">{t}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* lesson progress */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-sm font-bold">
          <span>Lesson Progress</span>
          <span className="text-ink/70">{pct}%</span>
        </div>
        <MasteryBar score={score} />
      </div>

      {/* stat tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile color="mint" big={`${pct}%`} label="Mastery" />
        <StatTile color="yellow" big={String(c.items.length)} label="Mga Tanong" />
        <StatTile color="sky" big="NA" label="Number & Algebra" />
        <StatTile color="rose" big={masteryLabel(score).split(' ')[0]} label="Antas" />
      </div>

      {/* mascot line */}
      <div className="mt-5 flex items-center gap-3 px-1">
        <Mascot size={48} float />
        <p className="text-sm text-ink/70">Handa na ako sa loob ng klase. Tara!</p>
      </div>

      {/* entry buttons (inline so nothing is hidden) */}
      <div className="mt-6 grid gap-3">
        <Button color="mint" className="text-lg" onClick={onEnter}>
          Pumasok sa 2D Klase →
        </Button>
        <Button color="sky" className="text-lg" onClick={onEnter3D}>
          3D Klase (beta) →
        </Button>
      </div>
    </div>
  )
}

function StatTile({ color, big, label }) {
  return (
    <Card color={color} className="p-4 text-center">
      <p className="font-display text-2xl font-extrabold leading-none">{big}</p>
      <p className="mt-1 text-xs font-bold text-ink/70">{label}</p>
    </Card>
  )
}
