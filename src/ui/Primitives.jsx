// Neo-brutalist building blocks: thick outlines, hard offset shadows, pills.

export function Button({ color = 'yellow', className = '', children, ...props }) {
  const colors = {
    yellow: 'bg-yellow',
    mint: 'bg-mint',
    sky: 'bg-sky',
    rose: 'bg-rose',
    peach: 'bg-peach',
    lavender: 'bg-lavender',
    white: 'bg-white',
  }
  return (
    <button className={`gb-btn ${colors[color] ?? colors.yellow} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Card({ color = 'white', className = '', children, ...props }) {
  const colors = {
    white: 'bg-white',
    cream: 'bg-cream',
    mint: 'bg-mint',
    sky: 'bg-sky',
    rose: 'bg-rose',
    peach: 'bg-peach',
    yellow: 'bg-yellow',
    lavender: 'bg-lavender',
  }
  return (
    <div className={`gb-card ${colors[color] ?? colors.white} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Chip({ color = 'mint', active = false, className = '', children, ...props }) {
  const colors = {
    mint: 'bg-mint',
    sky: 'bg-sky',
    rose: 'bg-rose',
    peach: 'bg-peach',
    yellow: 'bg-yellow',
    lavender: 'bg-lavender',
    white: 'bg-white',
  }
  return (
    <button
      className={`gb-chip ${active ? colors[color] : 'bg-white'} ${
        active ? 'shadow-hard-sm' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// MATATAG curriculum badge — the "not a generic wrapper" proof.
export function RefBadge({ refId, domain }) {
  const short = domain === 'Number and Algebra' ? 'NA' : domain
  const topic = refId?.split('-')[2] ?? ''
  return (
    <span className="gb-chip bg-yellow shadow-hard-sm text-xs">
      ⭐ G6 · {short} · {topic.charAt(0) + topic.slice(1).toLowerCase()}
    </span>
  )
}

export function MasteryBar({ score = 0.5 }) {
  const pct = Math.round((score ?? 0.5) * 100)
  return (
    <div className="w-full">
      <div className="h-4 w-full rounded-full border-[2.5px] border-outline bg-white overflow-hidden">
        <div
          className="h-full bg-mint transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// Light background doodles (sparkles, clouds).
export function Doodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="absolute left-4 top-6 text-2xl opacity-60">✨</span>
      <span className="absolute right-6 top-16 text-xl opacity-50">☁️</span>
      <span className="absolute left-8 bottom-24 text-xl opacity-40">🌱</span>
      <span className="absolute right-5 bottom-40 text-2xl opacity-50">✨</span>
    </div>
  )
}
