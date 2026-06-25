// Teacher Gabay — a smiling star in a grad cap.

export function Mascot({ size = 96, className = '', float = false }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`${float ? 'gb-float' : ''} ${className}`}
      aria-label="Teacher Gabay"
    >
      <path
        d="M60 24 L71 48 L97 50 L77 67 L84 92 L60 78 L36 92 L43 67 L23 50 L49 48 Z"
        fill="#F7D26A"
        stroke="#1C1410"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* grad cap */}
      <path d="M38 35 L60 26 L82 35 L60 44 Z" fill="#1C1410" />
      <rect x="58.5" y="42" width="3" height="9" fill="#1C1410" />
      <circle cx="62" cy="52" r="3" fill="#F4C3D0" stroke="#1C1410" strokeWidth="1.5" />
      {/* face */}
      <circle cx="51" cy="61" r="3.2" fill="#1C1410" />
      <circle cx="69" cy="61" r="3.2" fill="#1C1410" />
      <path
        d="M51 69 Q60 78 69 69"
        fill="none"
        stroke="#1C1410"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="44" cy="67" r="3.5" fill="#F4A87C" opacity="0.7" />
      <circle cx="76" cy="67" r="3.5" fill="#F4A87C" opacity="0.7" />
    </svg>
  )
}

// Speech bubble pointing down-left toward the mascot.
export function SpeechBubble({ children, speaking = false }) {
  return (
    <div
      className={`relative gb-card bg-white p-4 text-ink ${
        speaking ? 'ring-4 ring-mint/50' : ''
      }`}
    >
      <div className="text-base leading-snug">{children}</div>
      <div className="absolute -bottom-3 left-8 h-5 w-5 rotate-45 border-b-[2.5px] border-r-[2.5px] border-outline bg-white" />
    </div>
  )
}
