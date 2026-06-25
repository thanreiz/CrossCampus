import { useMemo, useState } from 'react'
import { Card, Button, Doodles, RefBadge, MasteryBar } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import { checkAnswer } from '../lib/check.js'

const ROUND_SPECS = [
  {
    ref: 'G6-NA-DEC-01',
    title: 'Total sa Sari-sari',
    customer: 'Bumili si Ana ng biskwit at juice.',
    shelf: ['Biskwit P12.50', 'Juice P7.25'],
    q: 'P12.50 + P7.25 = ? (bilang lang)',
    answer: '19.75',
    type: 'numeric',
    hint: 'I-align ang decimal point bago mag-add.',
  },
  {
    ref: 'G6-NA-PERCENT-03',
    title: 'Sale sa Palengke',
    customer: 'May 20% off sa item na P250.',
    shelf: ['Original P250', 'Discount 20%'],
    q: 'Magkano ang babayaran?',
    answer: '200',
    type: 'numeric',
    hint: '20% off means 80% ang babayaran: 0.80 x 250.',
  },
  {
    ref: 'G6-NA-PERCENT-02',
    title: 'Hanapin ang Diskwento',
    customer: 'Sapatos na P500, may 10% off.',
    shelf: ['Original P500', 'Discount 10%'],
    q: 'Magkano ang diskwento?',
    answer: '50',
    type: 'numeric',
    hint: 'Discount = rate x base.',
  },
  {
    ref: 'G6-NA-RATIO-01',
    title: 'Presyo ng Mansanas',
    customer: '3 mansanas ay P60. Pantay ang presyo bawat isa.',
    shelf: ['3 mansanas = P60', '5 mansanas = ?'],
    q: 'Magkano ang 5 mansanas?',
    answer: '100',
    type: 'numeric',
    hint: 'P60 / 3 = P20 bawat mansanas.',
  },
  {
    ref: 'G6-NA-PERCENT-01',
    title: 'Percent Display',
    customer: 'May sign na 25% off sa tindahan.',
    shelf: ['25%', 'Decimal?', 'Fraction?'],
    q: '25% bilang decimal = ?',
    answer: '0.25',
    type: 'numeric',
    hint: 'Percent to decimal: move two places left.',
  },
]

export default function Games({ competencies = [], mastery = {}, onAnswered = async () => {} }) {
  const rounds = useMemo(() => {
    return ROUND_SPECS.map((round) => {
      const competency = competencies.find((c) => c.ref === round.ref)
      return { ...round, competency }
    })
  }, [competencies])

  const [started, setStarted] = useState(false)
  const [roundIndex, setRoundIndex] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [coins, setCoins] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const round = rounds[roundIndex]
  const done = answered >= rounds.length
  const item = { q: round.q, answer: round.answer, type: round.type }
  const score = round?.ref ? mastery[round.ref] ?? 0.5 : 0.5

  async function submit() {
    if (result !== null || !input.trim()) return
    const ok = checkAnswer(item, input)
    setResult(ok)
    setAnswered((n) => n + 1)
    setCoins((n) => n + (ok ? 10 + streak * 2 : 2))
    setStreak((n) => (ok ? n + 1 : 0))
    await onAnswered(round.ref, ok)
  }

  function nextRound() {
    setRoundIndex((i) => (i + 1) % rounds.length)
    setInput('')
    setResult(null)
    setShowHint(false)
  }

  function resetGame() {
    setStarted(true)
    setRoundIndex(0)
    setInput('')
    setResult(null)
    setCoins(0)
    setStreak(0)
    setAnswered(0)
    setShowHint(false)
  }

  if (!started) {
    return (
      <div className="gb-shell relative min-h-screen px-5 pb-28 pt-6">
        <Doodles />
        <Header />
        <section className="relative z-10 mt-5 overflow-hidden rounded-card border-[2.5px] border-outline bg-peach p-5 shadow-hard">
          <div className="absolute right-4 top-4 rounded-full border-2 border-outline bg-white px-3 py-1 text-xs font-extrabold">
            Offline
          </div>
          <div className="flex min-h-[210px] flex-col justify-end rounded-card border-[2.5px] border-outline bg-[#f7d26a] p-4">
            <ShopAwning />
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight">Tindahan Game</h1>
            <p className="mt-1 max-w-[25ch] text-sm font-bold text-ink/75">
              Mag-compute ng total, discount, ratio, at percent habang nagtitinda.
            </p>
          </div>
        </section>

        <div className="mt-5 grid gap-3">
          <InfoPill label="Rounds" value={`${rounds.length} tanong`} />
          <InfoPill label="Reward" value="Coins + mastery" />
          <InfoPill label="Topics" value="Grade 6 Number & Algebra" />
        </div>

        <Button color="mint" className="mt-5 min-h-[56px] w-full text-lg" onClick={resetGame}>
          Simulan ang Tindahan
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
        <Doodles />
        <Header />
        <Card color="mint" className="gb-pop mt-6 p-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-card border-[2.5px] border-outline bg-white">
            <ShopIcon />
          </div>
          <h1 className="font-display text-3xl font-extrabold">Tindahan sarado!</h1>
          <p className="mt-2 text-lg font-extrabold">Kita mo: {coins} coins</p>
          <p className="mt-1 text-sm font-bold text-ink/70">
            Na-update ang mastery para sa mga competency na sinagutan mo.
          </p>
          <Button color="yellow" className="mt-5 min-h-[52px] w-full" onClick={resetGame}>
            Laro ulit
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="gb-shell relative min-h-screen overflow-hidden px-5 pb-28 pt-6">
      <Doodles />
      <Header />

      <div className="relative z-10 mt-4 flex items-center justify-between gap-2">
        <RefBadge refId={round.ref} domain={round.competency?.domain ?? 'Number and Algebra'} />
        <span className="gb-chip bg-yellow shadow-hard-sm text-xs">Coins {coins}</span>
      </div>

      <Card color="cream" className="gb-pop mt-4 overflow-hidden p-0">
        <div className="border-b-[2.5px] border-outline bg-peach p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase text-ink/55">Round {answered + 1} / {rounds.length}</p>
              <h1 className="font-display text-2xl font-extrabold leading-tight">{round.title}</h1>
            </div>
            <Mascot size={52} float />
          </div>
        </div>

        <div className="grid gap-4 p-4">
          <div className="rounded-card border-[2.5px] border-outline bg-white p-4 shadow-hard-sm">
            <ShopAwning small />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {round.shelf.map((label) => (
                <div key={label} className="rounded-2xl border-2 border-outline bg-cream px-3 py-2 text-center text-sm font-extrabold">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border-[2.5px] border-outline bg-sky p-4">
            <p className="text-xs font-extrabold uppercase text-ink/60">Customer</p>
            <p className="mt-1 font-display text-xl font-bold leading-snug">{round.customer}</p>
            <p className="mt-3 rounded-2xl border-2 border-outline bg-white p-3 text-lg font-extrabold leading-snug">
              {round.q}
            </p>
          </div>

          <div className="grid gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : nextRound())}
              disabled={result !== null}
              inputMode="decimal"
              placeholder="I-type ang sagot..."
              className="min-h-[58px] rounded-full border-[2.5px] border-outline bg-white px-5 text-xl font-extrabold outline-none focus:bg-cream disabled:opacity-80"
            />

            {result === null ? (
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Button color="mint" className="min-h-[56px] text-lg" onClick={submit}>
                  Bayaran
                </Button>
                <button className="gb-chip min-h-[56px] bg-white px-4" onClick={() => setShowHint((v) => !v)}>
                  Hint
                </button>
              </div>
            ) : (
              <Button color={result ? 'mint' : 'rose'} className="min-h-[56px] text-lg" onClick={nextRound}>
                Susunod
              </Button>
            )}
          </div>

          {showHint && result === null && (
            <p className="rounded-card border-[2.5px] border-outline bg-yellow p-3 text-sm font-bold">
              {round.hint}
            </p>
          )}

          {result !== null && (
            <div className={`rounded-card border-[2.5px] border-outline p-4 ${result ? 'bg-mint' : 'bg-rose'}`}>
              <p className="font-display text-xl font-extrabold">{result ? 'Tama!' : 'Halos!'}</p>
              <p className="mt-1 text-sm font-bold">
                {result ? `+${10 + Math.max(0, streak - 1) * 2} coins` : `Sagot: ${round.answer}`}
              </p>
            </div>
          )}

          <div>
            <div className="mb-1 flex justify-between text-xs font-extrabold text-ink/60">
              <span>Mastery</span>
              <span>{Math.round(score * 100)}%</span>
            </div>
            <MasteryBar score={score} />
          </div>
        </div>
      </Card>
    </div>
  )
}

function Header() {
  return (
    <div className="relative z-10 flex items-center gap-2">
      <Mascot size={36} />
      <span className="font-display text-xl font-extrabold">Gabay Games</span>
    </div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-card border-[2.5px] border-outline bg-white px-4 py-3 shadow-hard-sm">
      <span className="text-xs font-extrabold uppercase text-ink/55">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

function ShopAwning({ small = false }) {
  return (
    <div className={`grid ${small ? 'h-10' : 'h-14'} grid-cols-5 overflow-hidden rounded-t-card border-[2.5px] border-outline bg-white`}>
      {['bg-rose', 'bg-white', 'bg-yellow', 'bg-white', 'bg-rose'].map((color, index) => (
        <span key={index} className={`${color} border-r-2 border-outline last:border-r-0`} />
      ))}
    </div>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 80 80" width="70" height="70" aria-hidden="true">
      <path d="M12 30 L17 14 h46 l5 16 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <rect x="18" y="30" width="44" height="34" rx="3" fill="#A9D8F0" stroke="#1C1410" strokeWidth="4" />
      <rect x="32" y="42" width="16" height="22" fill="#fff" stroke="#1C1410" strokeWidth="4" />
    </svg>
  )
}
