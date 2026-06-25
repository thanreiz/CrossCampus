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

// MATATAG curriculum badge - the "not a generic wrapper" proof.
export function RefBadge({ refId, domain }) {
  const short = domain === 'Number and Algebra' ? 'NA' : domain
  const topic = refId?.split('-')[2] ?? ''
  return (
    <span className="gb-chip bg-yellow shadow-hard-sm text-xs">
      G6 - {short} - {topic.charAt(0) + topic.slice(1).toLowerCase()}
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

// SVG doodles — drawn, not emoji (survives any text/emoji stripping).
export function Sparkle({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
        fill="#F7D26A"
        stroke="#1C1410"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Cloud({ size = 40, className = '' }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M16 32 a12 12 0 0 1 2-23 a14 14 0 0 1 27 3 a10 10 0 0 1 1 20 Z"
        fill="#ffffff"
        stroke="#1C1410"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Plant({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 32 40" width={size} height={size} className={className} aria-hidden="true">
      <path d="M16 38 V20" stroke="#1C1410" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 24 C8 22 6 14 10 10 C16 12 18 18 16 24 Z" fill="#8FD9B6" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 20 C24 18 26 10 22 6 C16 8 14 14 16 20 Z" fill="#8FD9B6" stroke="#1C1410" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

// Light background doodles (sparkles, clouds).
export function Doodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Sparkle className="absolute left-4 top-6 opacity-70" size={22} />
      <Cloud className="absolute right-5 top-14 opacity-70" size={40} />
      <Sparkle className="absolute right-8 bottom-44 opacity-60" size={16} />
      <Plant className="absolute left-6 bottom-20 opacity-70" size={28} />
    </div>
  )
}

