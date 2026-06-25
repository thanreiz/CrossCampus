// Persistent bottom navigation — design basis: Stitch tab bar.
// 4 tabs: Lessons, Practice, Games, Profile. SVG icons (no emoji).

const ITEMS = [
  { key: 'lessons', label: 'Lessons', Icon: BookIcon },
  { key: 'practice', label: 'Practice', Icon: PencilIcon },
  { key: 'games', label: 'Games', Icon: GameIcon },
  { key: 'profile', label: 'Profile', Icon: PersonIcon },
]

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t-[2.5px] border-outline bg-white px-2 py-1.5">
      <div className="flex items-stretch justify-around gap-1">
        {ITEMS.map(({ key, label, Icon }) => {
          const on = active === key
          return (
            <button
              key={key}
              onClick={() => onNav(key)}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 ${
                on ? 'border-[2.5px] border-outline bg-yellow shadow-hard-sm' : 'border-[2.5px] border-transparent'
              }`}
            >
              <Icon />
              <span className={`text-[13px] font-extrabold ${on ? 'text-ink' : 'text-ink/55'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M5 5 h6 a2 2 0 0 1 2 2 v12 a2 2 0 0 0 -2 -2 H5 Z" fill="none" stroke="#1C1410" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M19 5 h-6 a2 2 0 0 0 -2 2 v12 a2 2 0 0 1 2 -2 h6 Z" fill="none" stroke="#1C1410" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M5 19 l1 -4 L16 5 l3 3 L9 18 Z" fill="none" stroke="#1C1410" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M14 7 l3 3" stroke="#1C1410" strokeWidth="2.2" />
    </svg>
  )
}
function GameIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <rect x="3" y="8" width="18" height="10" rx="5" fill="none" stroke="#1C1410" strokeWidth="2.2" />
      <path d="M7 11 v4 M5 13 h4" stroke="#1C1410" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="12.5" r="1.2" fill="#1C1410" />
      <circle cx="18.5" cy="14.5" r="1.2" fill="#1C1410" />
    </svg>
  )
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" fill="none" stroke="#1C1410" strokeWidth="2.2" />
      <path d="M5 20 a7 7 0 0 1 14 0" fill="none" stroke="#1C1410" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
