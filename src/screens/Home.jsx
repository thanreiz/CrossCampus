import { Mascot } from '../ui/Mascot.jsx'
import { Doodles } from '../ui/Primitives.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { LANGS } from '../lib/lang.js'
import { makeT } from '../lib/i18n.js'

// Home = a hallway with doors. Design basis: Stitch "Gabay - Home Hallway".
const DOORS = [
  { key: 'lessons', titleKey: 'home.lessons.title', statusKey: 'home.lessons.status', ctaKey: 'home.lessons.cta', color: '#8FD9B6', Icon: BookIcon, locked: false },
  { key: 'classroom', titleKey: 'home.classroom.title', statusKey: 'home.classroom.status', ctaKey: 'home.classroom.cta', color: '#A9D8F0', Icon: StarIcon, locked: false },
  { key: 'games', titleKey: 'home.games.title', statusKey: 'home.games.status', ctaKey: 'home.games.cta', color: '#F4C3D0', Icon: ShopIcon, locked: false },
]

export default function Home({ onPick, online = true, lang = 'taglish', onLang }) {
  const tt = makeT(lang)
  return (
    <div className="gb-shell relative min-h-screen overflow-hidden pb-28">
      {/* top app bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-[2.5px] border-outline bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-outline bg-yellow shadow-hard-sm">
            <Mascot size={28} />
          </span>
          <span className="font-display text-2xl font-extrabold">Gabay</span>
        </div>
        <OnlineBadge online={online} className="bg-mint" />
      </header>

      <Doodles />

      {/* hero */}
      <div className="relative z-10 px-5 pt-6">
        <span className="gb-chip bg-white shadow-hard-sm mb-2 text-[10px] uppercase tracking-wide">
          {tt('home.hallwayTag')}
        </span>
        <h1 className="font-display text-3xl font-extrabold leading-tight">{tt('home.greeting')}</h1>
        <p className="mt-1 text-sm font-bold text-ink/70">{tt('home.subtitle')}</p>

        {/* Language picker — sets lesson + tutor language app-wide (persisted). */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-ink/60">{tt('common.language')}</span>
          <div className="flex gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => onLang?.(l.key)}
                aria-pressed={lang === l.key}
                className={`rounded-full border-2 border-outline px-3 py-1 text-xs font-extrabold shadow-hard-sm transition ${
                  lang === l.key ? 'bg-yellow text-ink' : 'bg-white text-ink/70'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* hallway floor */}
      <div className="gb-hallway-floor pointer-events-none absolute bottom-0 left-0 z-0 h-64 w-full" />

      {/* door cards */}
      <div className="relative z-10 mt-5 flex flex-col gap-5 px-5">
        {DOORS.map((d) => {
          const Icon = d.Icon
          return (
            <div
              key={d.key}
              className="gb-hover-lift rounded-card border-[2.5px] border-outline p-4 shadow-hard"
              style={{ backgroundColor: d.color }}
            >
              {/* badge row */}
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border-2 border-outline px-2.5 py-0.5 text-[10px] font-extrabold ${
                    d.locked ? 'bg-white text-ink/60' : 'bg-white'
                  }`}
                >
                  {tt('home.open')}
                </span>
                <span className="rounded-full border-2 border-outline bg-white/80 px-2.5 py-0.5 text-[10px] font-bold">
                  {tt(d.statusKey)}
                </span>
              </div>

              {/* icon + title */}
              <div className="mt-3 flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[2.5px] border-outline bg-white">
                  <Icon />
                </span>
                <h2 className="mt-2 font-display text-xl font-extrabold leading-tight">{tt(d.titleKey)}</h2>
              </div>

              {/* inner button */}
              <button
                disabled={d.locked}
                onClick={() => !d.locked && onPick(d.key)}
                className="gb-btn mt-3 w-full bg-white disabled:opacity-50"
              >
                {tt(d.ctaKey)} {d.locked ? '' : '->'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
      <path d="M6 6 h9 a3 3 0 0 1 3 3 v17 a3 3 0 0 0 -3 -3 h-9 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
      <path d="M26 6 h-9 a3 3 0 0 0 -3 3 v17 a3 3 0 0 1 3 -3 h9 Z" fill="#F7D26A" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
function StarIcon() {
  return (
    <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
      <path d="M16 4 L19 13 L29 13 L21 19 L24 28 L16 22 L8 28 L11 19 L3 13 L13 13 Z" fill="#F7D26A" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
function ShopIcon() {
  return (
    <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
      <path d="M5 12 L7 6 h18 l2 6 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
      <rect x="7" y="12" width="18" height="14" fill="#A9D8F0" stroke="#1C1410" strokeWidth="2" />
      <rect x="13" y="17" width="6" height="9" fill="#fff" stroke="#1C1410" strokeWidth="2" />
    </svg>
  )
}


