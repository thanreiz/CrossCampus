import { Card, Button, Doodles, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { topicTitle } from '../lib/topics.js'
import { makeT } from '../lib/i18n.js'

// Start choice - design basis: Stitch "Gabay - Start Choice".
export default function StartChoice({ next, mastery, online = true, lang = 'taglish', onAuto, onBrowse, onBack }) {
  const tt = makeT(lang)
  const score = next ? mastery[next.ref] ?? 0.5 : 0.5
  const pct = Math.round(score * 100)
  const title = next ? topicTitle(next.ref, next.competency) : ''

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
        {tt('start.heading')}
      </h1>
      <p className="mb-5 text-sm font-bold text-ink/70">
        {tt('start.sub')}
      </p>

      {/* 01 - CONTINUE */}
      {next && (
        <Card color="mint" className="gb-pop mb-4 p-5">
          <span className="gb-chip bg-white shadow-hard-sm text-[10px] uppercase tracking-wide">
            {tt('start.continueTag')}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
            {tt('start.continueTitle')}
          </h2>

          <div className="mt-3 rounded-card border-[2.5px] border-outline bg-white p-3">
            <p className="font-bold leading-snug">{title}</p>
            <p className="mt-2 text-xs font-bold text-ink/60">{tt('start.masteryProgress')}</p>
            <div className="mt-1 flex items-center gap-2">
              <MasteryBar score={score} />
              <span className="text-xs font-bold">{pct}%</span>
            </div>
          </div>

          <Button color="yellow" className="mt-4 w-full text-lg" onClick={() => onAuto(next)}>
            {tt('start.startNow')} &rarr;
          </Button>
        </Card>
      )}

      {/* 02 - BROWSE */}
      <Card color="sky" className="gb-pop p-5">
        <span className="gb-chip bg-white shadow-hard-sm text-[10px] uppercase tracking-wide">
          {tt('start.browseTag')}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
          {tt('start.browseTitle')}
        </h2>
        <p className="mt-1 text-sm font-bold text-ink/70">
          {tt('start.browseSub')}
        </p>
        <Button color="white" className="mt-4 w-full text-lg" onClick={onBrowse}>
          {tt('start.viewList')} &rarr;
        </Button>
      </Card>
    </div>
  )
}




