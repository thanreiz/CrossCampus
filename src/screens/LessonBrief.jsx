import { Card, Button, Doodles, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { masteryColor } from '../lib/mastery.js'
import { topicTitle, topicArea } from '../lib/topics.js'
import { makeT } from '../lib/i18n.js'

// Lesson brief - design basis: Stitch "Gabay - Lesson View".
// header -> title card -> "What you will do" -> progress -> stat tiles -> sticky 2D/3D entry.
export default function LessonBrief({ competency, score = 0.5, online = true, lang = 'taglish', onEnter, onEnter3D, onBack }) {
  const c = competency
  const tt = makeT(lang)
  const title = topicTitle(c.ref, c.competency)
  const pct = Math.round((score ?? 0.5) * 100)

  const tasks = [
    tt('brief.task.understand', { topic: c.competency.replace(/\.$/, '') }),
    tt('brief.task.answer'),
    tt('brief.task.ask'),
  ]

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

      {/* title card */}
      <Card color="cream" className="gb-pop p-5">
        <RefBadge refId={c.ref} domain={c.domain} />
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight">{title}</h1>
        <p className="mt-2 text-sm font-bold text-ink/70">{c.competency}</p>

        <div className="mt-3 rounded-card border-[2.5px] border-outline bg-white p-3 text-sm">
          <p className="font-bold text-ink/70">{tt('brief.contentStandard')}</p>
          <p className="text-ink/80">{c.content_standard}</p>
        </div>
      </Card>

      {/* "What you will do" */}
      <Card color="peach" className="gb-pop mt-4 p-5">
        <span className="gb-chip bg-white shadow-hard-sm text-xs">{tt('brief.whatYouDo')}</span>
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
          <span>{tt('brief.lessonProgress')}</span>
          <span className="text-ink/70">{pct}%</span>
        </div>
        <MasteryBar score={score} />
      </div>

      {/* stat tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile color="mint" big={`${pct}%`} label={tt('common.mastery')} />
        <StatTile color="yellow" big={String(c.items.length)} label={tt('brief.questions')} />
        <StatTile color="sky" big={topicArea(c.ref).split(' ').filter((w) => !/^(and|&)$/i.test(w)).map((w) => w[0].toUpperCase()).join('')} label={topicArea(c.ref)} />
        <StatTile
          color={masteryColor(score).bg.replace('bg-', '')}
          big={tt('band.' + masteryColor(score).band)}
          label={tt('brief.level')}
        />
      </div>

      {/* mascot line */}
      <div className="mt-5 flex items-center gap-3 px-1">
        <Mascot size={48} float />
        <p className="text-sm text-ink/70">{tt('brief.ready')}</p>
      </div>

      {/* entry buttons (inline so nothing is hidden) */}
      <div className="mt-6 grid gap-3">
        <Button color="mint" className="text-lg" onClick={onEnter}>
          {tt('brief.enter2d')} &rarr;
        </Button>
        <Button color="sky" className="text-lg" onClick={onEnter3D}>
          {tt('brief.enter3d')} &rarr;
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




