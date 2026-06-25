import { Mascot } from '../ui/Mascot.jsx'
import { Card, Doodles } from '../ui/Primitives.jsx'

// Home = a hallway with 3 doors.
const DOORS = [
  {
    key: 'lessons',
    title: 'Mga Aralin',
    sub: 'Pumili ng topic at mag-aral',
    emoji: '🚪',
    color: 'mint',
  },
  {
    key: 'classroom',
    title: 'Klase ni Teacher Gabay',
    sub: 'Pumasok sa silid-aralan',
    emoji: '🏫',
    color: 'sky',
  },
  {
    key: 'progress',
    title: 'Aking Progreso',
    sub: 'Tingnan ang iyong mastery',
    emoji: '📈',
    color: 'rose',
  },
]

export default function Home({ onPick }) {
  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-10 pt-8">
      <Doodles />
      <header className="mb-6 flex items-center gap-3">
        <Mascot size={64} />
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none">Kumusta! 👋</h1>
          <p className="text-sm text-ink/70">Saan tayo pupunta ngayon?</p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {DOORS.map((d) => (
          <Card
            key={d.key}
            color={d.color}
            className="gb-pop cursor-pointer p-5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
            role="button"
            tabIndex={0}
            onClick={() => onPick(d.key)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(d.key)}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{d.emoji}</span>
              <div>
                <h2 className="font-display text-xl font-bold leading-tight">{d.title}</h2>
                <p className="text-sm text-ink/70">{d.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
