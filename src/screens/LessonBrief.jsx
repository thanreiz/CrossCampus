import { Card, Button, Doodles, RefBadge } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'

// Lesson brief (the "doorway brief"): topic + competency ref/statement + task list.
export default function LessonBrief({ competency, onEnter, onBack }) {
  const c = competency
  const tasks = [
    `Intindihin ang aralin: ${c.competency.replace(/\.$/, '')}.`,
    'Sagutin ang mga tanong ni Teacher Gabay sa pisara.',
    'Magtanong kung may hindi malinaw — itaas ang kamay! 🙋',
  ]

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-10 pt-6">
      <Doodles />
      <button className="mb-4 self-start gb-chip bg-white" onClick={onBack}>
        ← Balik
      </button>

      <Card color="cream" className="gb-pop p-5">
        <RefBadge refId={c.ref} domain={c.domain} />
        <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight">{c.competency}</h1>

        <div className="mt-3 rounded-card border-[2.5px] border-outline bg-white p-3 text-sm">
          <p className="font-bold text-ink/70">Content Standard</p>
          <p className="text-ink/80">{c.content_standard}</p>
        </div>

        <h2 className="mt-5 font-display text-xl font-bold">📋 Ang gagawin mo</h2>
        <ol className="mt-2 flex flex-col gap-2">
          {tasks.map((t, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="gb-chip bg-yellow shadow-hard-sm h-7 w-7 justify-center p-0">
                {i + 1}
              </span>
              <span className="pt-1 leading-snug">{t}</span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-6 flex items-center gap-3 px-1">
        <Mascot size={56} float />
        <p className="text-sm text-ink/70">Handa na ako sa loob ng klase. Tara!</p>
      </div>

      <Button color="mint" className="mt-4 text-lg" onClick={onEnter}>
        🏫 Pumasok sa Klase →
      </Button>
    </div>
  )
}
