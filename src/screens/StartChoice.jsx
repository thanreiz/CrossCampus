import { Card, Button, Doodles, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'

const TITLES = {
  'G6-NA-PERCENT-01': 'Percent, Fractions & Decimals',
  'G6-NA-PERCENT-02': 'Percentage, Rate & Base',
  'G6-NA-PERCENT-03': 'Percent & Discounts',
  'G6-NA-RATIO-01': 'Ratio & Proportion',
  'G6-NA-DEC-01': 'Decimal Operations',
  'G6-NA-GCFLCM-01': 'GCF & LCM',
}

// Start choice - design basis: Stitch "Gabay - Start Choice".
export default function StartChoice({ next, mastery, online = true, onAuto, onBrowse, onBack }) {
  const score = next ? mastery[next.ref] ?? 0.5 : 0.5
  const pct = Math.round(score * 100)
  const title = next ? TITLES[next.ref] ?? next.competency : ''

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
        Paano ka magsisimula?
      </h1>
      <p className="mb-5 text-sm font-bold text-ink/70">
        Galingan mo sa math, Explorer! Piliin mo kung ano ang gusto mong gawin.
      </p>

      {/* 01 - TULOY */}
      {next && (
        <Card color="mint" className="gb-pop mb-4 p-5">
          <span className="gb-chip bg-white shadow-hard-sm text-[10px] uppercase tracking-wide">
            01 - Tuloy
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
            Ituloy ang aralin
          </h2>

          <div className="mt-3 rounded-card border-[2.5px] border-outline bg-white p-3">
            <p className="font-bold leading-snug">{title}</p>
            <p className="mt-2 text-xs font-bold text-ink/60">Mastery Progress</p>
            <div className="mt-1 flex items-center gap-2">
              <MasteryBar score={score} />
              <span className="text-xs font-bold">{pct}%</span>
            </div>
          </div>

          <Button color="yellow" className="mt-4 w-full text-lg" onClick={() => onAuto(next)}>
            Magsimula na &rarr;
          </Button>
        </Card>
      )}

      {/* 02 - TINGNAN */}
      <Card color="sky" className="gb-pop p-5">
        <span className="gb-chip bg-white shadow-hard-sm text-[10px] uppercase tracking-wide">
          02 - Tingnan
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
          Tingnan lahat ng topics
        </h2>
        <p className="mt-1 text-sm font-bold text-ink/70">
          Hanapin ang buong listahan ng mga aralin sa Number & Algebra.
        </p>
        <Button color="white" className="mt-4 w-full text-lg" onClick={onBrowse}>
          Tingnan ang listahan &rarr;
        </Button>
      </Card>
    </div>
  )
}




