// Per-topic diagrams that sit above the question text — turns "read the number"
// into "see the shape". Parsed straight from the question string, so content.json
// stays untouched; a question that doesn't match the expected pattern just
// renders no visual (safe fallback), it never blocks answering.

function classifyAngle(deg) {
  if (deg < 90) return '#8FD9B6' // mint — acute
  if (deg === 90) return '#A9D8F0' // sky — right
  if (deg < 180) return '#F4A87C' // peach — obtuse
  return '#CDBCEC' // lavender — straight
}

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

export function AngleDiagram({ degrees }) {
  const cx = 110, cy = 125, rArm = 85, rArc = 32
  const color = classifyAngle(degrees)
  const arm2 = polar(cx, cy, rArm, degrees)
  const arcStart = polar(cx, cy, rArc, 0)
  const arcEnd = polar(cx, cy, rArc, degrees)
  const largeArc = degrees > 180 ? 1 : 0
  const wedge = `M ${cx} ${cy} L ${arcStart.x} ${arcStart.y} A ${rArc} ${rArc} 0 ${largeArc} 0 ${arcEnd.x} ${arcEnd.y} Z`
  const label = polar(cx, cy, rArc + 22, degrees / 2)

  return (
    <svg viewBox="0 0 220 150" width="100%" height="140" role="img" aria-label={`${degrees} degree angle`}>
      <path d={wedge} fill={color} stroke="#1C1410" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={cx} y1={cy} x2={cx + rArm} y2={cy} stroke="#1C1410" strokeWidth="4" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={arm2.x} y2={arm2.y} stroke="#1C1410" strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4.5" fill="#1C1410" />
      <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="800" fill="#1C1410">
        {degrees}°
      </text>
    </svg>
  )
}

const BAR_WIDTH = 150

function FractionBox({ num, den, color }) {
  const cellW = BAR_WIDTH / den
  return (
    <div className="flex h-9 overflow-hidden rounded-md border-2 border-outline" style={{ width: BAR_WIDTH }}>
      {Array.from({ length: den }).map((_, i) => (
        <div
          key={i}
          className={`h-full border-r-2 border-outline last:border-r-0 ${i < num ? color : 'bg-white'}`}
          style={{ width: cellW }}
        />
      ))}
    </div>
  )
}

function FractionOperand({ whole = 0, num, den, color }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from({ length: whole }).map((_, i) => (
        <div key={i} className={`h-9 rounded-md border-2 border-outline ${color}`} style={{ width: BAR_WIDTH }} />
      ))}
      <FractionBox num={num} den={den} color={color} />
    </div>
  )
}

export function FractionBars({ a, b, op }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-1">
      <FractionOperand {...a} color="bg-mint" />
      <span className="font-display text-2xl font-extrabold">{op}</span>
      <FractionOperand {...b} color="bg-sky" />
    </div>
  )
}

const ANGLE_RE = /(-?\d+(?:\.\d+)?)\s*°/
const FRACTION_RE = /(?:(\d+)\s+)?(\d+)\/(\d+)\s*([+\-−])\s*(?:(\d+)\s+)?(\d+)\/(\d+)/

// refId → q string in, diagram or null out. Add a case here for each topic
// that gets a visual; everything else stays text-only.
export function TopicVisual({ refId, q }) {
  if (refId === '6MG-IIe-5') {
    const m = ANGLE_RE.exec(q ?? '')
    if (!m) return null
    return <AngleDiagram degrees={parseFloat(m[1])} />
  }

  if (refId === '6NA-Ic-3') {
    const m = FRACTION_RE.exec(q ?? '')
    if (!m) return null
    const [, w1, n1, d1, op, w2, n2, d2] = m
    const den1 = +d1, den2 = +d2
    if (den1 > 16 || den2 > 16) return null // too many cells to read clearly
    return (
      <FractionBars
        a={{ whole: +(w1 || 0), num: +n1, den: den1 }}
        b={{ whole: +(w2 || 0), num: +n2, den: den2 }}
        op={op === '+' ? '+' : '−'}
      />
    )
  }

  return null
}
