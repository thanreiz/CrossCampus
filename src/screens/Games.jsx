import { useEffect, useState } from 'react'
import { Card, Button, Doodles, RefBadge, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer } from '../lib/check.js'
import { feedbackFor } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicTitle } from '../lib/topics.js'
import { makeT, localize } from '../lib/i18n.js'
import { sfx, playButtonSfx } from '../lib/sound.js'

const COUNT_OPTIONS = [5, 10, 15, 20]

// The four mini-games. Each is a themed wrapper over a slice of the Grade 6
// MATATAG curriculum: `domains` matches a whole learning area, `refs` matches
// specific competencies (so Garden and House can split Measurement & Geometry).
// `accent` is the inner card color; `awning` are the stripe classes.
const GAMES = [
  {
    key: 'store',
    outer: 'bg-peach',
    accent: '#f7d26a',
    awning: ['bg-rose', 'bg-white', 'bg-yellow', 'bg-white', 'bg-rose'],
    Icon: ShopIcon,
    badgeKeys: ['number', 'percent', 'ratio'],
    domains: ['Number and Algebra'],
  },
  {
    key: 'garden',
    outer: 'bg-mint',
    accent: '#bfe8cf',
    awning: ['bg-mint', 'bg-white', 'bg-yellow', 'bg-white', 'bg-mint'],
    Icon: GardenIcon,
    badgeKeys: ['geometry', 'area', 'perimeter'],
    refs: ['6MG-Ig-7', '6MG-IIIa-1', '6MG-IIIb-2', '6MG-IIIc-3', '6MG-IIId-4'],
  },
  {
    key: 'house',
    outer: 'bg-sky',
    accent: '#bfe2f7',
    awning: ['bg-sky', 'bg-white', 'bg-peach', 'bg-white', 'bg-sky'],
    Icon: HouseIcon,
    badgeKeys: ['geometry', 'angles', 'volume'],
    refs: ['6MG-IIe-5', '6MG-IIf-6', '6MG-IIg-7'],
  },
  {
    key: 'fiesta',
    outer: 'bg-lavender',
    accent: '#ddd0f5',
    awning: ['bg-lavender', 'bg-white', 'bg-rose', 'bg-white', 'bg-lavender'],
    Icon: FiestaIcon,
    badgeKeys: ['data', 'stats', 'probability'],
    domains: ['Data and Probability'],
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a question pool from the competencies that belong to the chosen game.
// Falls back to the whole curriculum if the slice is somehow empty. Repeats the
// shuffled pool if the learner wants more questions than we have.
function buildQuestions(competencies, count, game) {
  const match = (c) =>
    game.refs ? game.refs.includes(c.ref) : game.domains ? game.domains.includes(c.domain) : true
  const scoped = competencies.filter(match)
  const source = scoped.length ? scoped : competencies

  const pool = []
  for (const c of source) {
    for (const it of c.items ?? []) {
      pool.push({ ...it, ref: c.ref, domain: c.domain, title: topicTitle(c.ref, c.competency) })
    }
  }
  let out = shuffle(pool)
  while (out.length < count) out = out.concat(shuffle(pool))
  return out.slice(0, count)
}

export default function Games({ online = true, competencies = [], mastery = {}, lang = 'taglish', onAnswered = async () => {} }) {
  const tt = makeT(lang)
  const [gameKey, setGameKey] = useState(null)
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [fb, setFb] = useState(null)
  const [coins, setCoins] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [log, setLog] = useState([])

  const game = GAMES.find((g) => g.key === gameKey) ?? null
  const round = questions[idx]
  const done = started && answered >= questions.length
  const score = round?.ref ? mastery[round.ref] ?? 0.5 : 0.5

  // Victory jingle when a game finishes (summary appears).
  useEffect(() => {
    if (done) sfx('finish')
  }, [done])

  function startGame() {
    if (!game) return
    setQuestions(buildQuestions(competencies, count, game))
    setStarted(true)
    setIdx(0)
    setInput('')
    setResult(null)
    setFb(null)
    setCoins(0)
    setStreak(0)
    setAnswered(0)
    setLog([])
  }

  function backToPicker() {
    setGameKey(null)
    setStarted(false)
  }

  async function submit() {
    if (result !== null || !input.trim()) return
    const locRound = { ...round, q: localize(round.q, lang), solution: localize(round.solution, lang) }
    const ok = checkAnswer(round, input)
    const f = feedbackFor(locRound, ok, lang, idx)
    setResult(ok)
    setFb(f)
    sfx(ok ? 'correct' : 'wrong')
    if (ok && streak >= 2) sfx('coin') // reward a hot streak
    setAnswered((n) => n + 1)
    setCoins((n) => n + (ok ? 10 + streak * 2 : 2))
    setStreak((n) => (ok ? n + 1 : 0))
    setLog((l) => [...l, { q: locRound.q, your: input.trim(), answer: round.answer, correct: ok, solution: locRound.solution }])
    recordAttempt({ ref: round.ref, q: locRound.q, your: input.trim(), answer: round.answer, correct: ok, feedback: ok ? f.headline : f.body })
    await onAnswered(round.ref, ok)
  }

  function nextRound() {
    setIdx((i) => i + 1)
    setInput('')
    setResult(null)
    setFb(null)
  }

  // ---- Game picker ----
  if (!game) {
    return (
      <div className="gb-shell relative min-h-screen px-5 pb-28 pt-6">
        <Doodles />
        <Header online={online} />
        <div className="relative z-10 mt-5">
          <h1 className="font-display text-3xl font-extrabold">{tt('games.pick')}</h1>
          <p className="mt-1 text-base font-bold text-ink/70">{tt('games.pickSub')}</p>
        </div>
        <div className="relative z-10 mt-4 grid grid-cols-1 gap-3">
          {GAMES.map((g) => (
            <button
              key={g.key}
              onClick={() => {
                playButtonSfx()
                setGameKey(g.key)
              }}
              className={`flex items-center gap-4 rounded-card border-[2.5px] border-outline ${g.outer} p-4 text-left shadow-hard active:translate-y-0.5`}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card border-[2.5px] border-outline bg-white">
                <g.Icon />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-extrabold leading-tight">{tt(`games.${g.key}.name`)}</span>
                <span className="mt-1 block text-sm font-bold text-ink/70">{tt(`games.${g.key}.tagline`)}</span>
                <GameBadges game={g} tt={tt} className="mt-2" />
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- Start screen ----
  if (!started) {
    return (
      <div className="gb-shell relative min-h-screen px-5 pb-28 pt-6">
        <Doodles />
        <Header online={online} />
        <button
          onClick={() => {
            playButtonSfx()
            backToPicker()
          }}
          className="relative z-10 mt-4 text-sm font-extrabold text-ink/60 underline"
        >
          ← {tt('games.chooseAnother')}
        </button>
        <section className={`relative z-10 mt-3 overflow-hidden rounded-card border-[2.5px] border-outline ${game.outer} p-5 shadow-hard`}>
          <div
            className="flex min-h-[180px] flex-col justify-end rounded-card border-[2.5px] border-outline p-4"
            style={{ backgroundColor: game.accent }}
          >
            <Awning colors={game.awning} />
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight">{tt(`games.${game.key}.name`)}</h1>
            <p className="mt-1 max-w-[26ch] text-base font-bold text-ink/75">{tt(`games.${game.key}.tagline`)}</p>
            <GameBadges game={game} tt={tt} className="mt-3" />
          </div>
        </section>

        {/* number of questions (5–20) */}
        <div className="mt-5">
          <p className="mb-2 text-base font-extrabold">{tt('games.howMany')}</p>
          <div className="flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => {
                  playButtonSfx()
                  setCount(n)
                }}
                className={`gb-btn flex-1 text-lg ${count === n ? 'bg-mint' : 'bg-white'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs font-bold text-ink/55">{tt('games.minMax')}</p>
        </div>

        <Button color="mint" className="mt-5 min-h-[58px] w-full text-xl" onClick={startGame}>
          {tt(`games.${game.key}.start`, { n: count })}
        </Button>
      </div>
    )
  }

  // ---- Summary ----
  if (done) {
    const correct = log.filter((l) => l.correct).length
    const wrong = log.filter((l) => !l.correct)
    const accuracy = log.length ? Math.round((correct / log.length) * 100) : 0
    const summaryKey = accuracy === 100 ? 'perfect' : accuracy >= 70 ? 'great' : 'practice'
    return (
      <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
        <Doodles />
        <Header online={online} />
        <Card color="mint" className="gb-pop mt-6 p-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-card border-[2.5px] border-outline bg-white">
            <game.Icon />
          </div>
          <h1 className="font-display text-3xl font-extrabold">{tt(`games.${game.key}.closed`)}</h1>
          <p className="mt-2 text-lg font-extrabold">{tt('games.summary.' + summaryKey)}</p>
          <p className="mt-1 text-sm font-bold text-ink/70">{tt('games.summaryPracticed', { game: tt(`games.${game.key}.name`) })}</p>
          <GameBadges game={game} tt={tt} className="mt-3 justify-center" />
          <p className="mt-3 text-lg font-extrabold">{tt('games.earned', { coins })}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <Stat label={tt('games.answered')} value={log.length} color="bg-sky" />
            <Stat label={tt('common.correct')} value={correct} color="bg-mint" />
            <Stat label={tt('common.wrong')} value={wrong.length} color="bg-rose" />
            <Stat label={tt('games.accuracy')} value={`${accuracy}%`} color="bg-yellow" />
          </div>
        </Card>

        {wrong.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-base font-extrabold">{tt('class.reviewMissed')}</p>
            <div className="flex flex-col gap-3">
              {wrong.map((a, i) => (
                <Card key={i} color="cream" className="p-4">
                  <p className="text-base font-bold">
                    <span className="text-ink/60">{tt('common.question')}:</span> {a.q}
                  </p>
                  <p className="mt-1 text-base font-bold">
                    <span className="text-ink/60">{tt('common.yourAnswer')}:</span>{' '}
                    <span className="text-rose-700">{a.your || '—'}</span>
                  </p>
                  <p className="mt-1 text-base font-bold">
                    <span className="text-ink/60">{tt('common.correctAnswer')}:</span>{' '}
                    <span className="text-green-700">{a.answer}</span>
                  </p>
                  {a.solution && (
                    <p className="mt-1 text-base">
                      <span className="font-bold text-ink/60">{tt('common.explanation')}:</span> <RichText>{a.solution}</RichText>
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <Button color="yellow" className="mt-5 min-h-[54px] w-full text-lg" onClick={() => setStarted(false)}>
          {tt('games.playAgain')}
        </Button>
        <Button color="white" className="mt-3 min-h-[54px] w-full text-lg" onClick={backToPicker}>
          {tt('games.chooseAnother')}
        </Button>
      </div>
    )
  }

  // ---- Play ----
  return (
    <div className="gb-shell relative min-h-screen overflow-hidden px-5 pb-28 pt-6">
      <Doodles />
      <Header online={online} />

      <div className="relative z-10 mt-4 flex items-center justify-between gap-2">
        <RefBadge refId={round.ref} domain={round.domain || 'Number and Algebra'} />
        <span className="gb-chip bg-yellow shadow-hard-sm text-sm">{tt('games.coins')} {coins}</span>
      </div>

      <Card color="cream" className="gb-pop mt-4 overflow-hidden p-0">
        <div className="border-b-[2.5px] border-outline bg-peach p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold uppercase text-ink/55">{tt('common.question')} {answered + 1} / {questions.length}</p>
              <h1 className="font-display text-2xl font-extrabold leading-tight">{round.title}</h1>
            </div>
            <Mascot size={52} float />
          </div>
        </div>

        <div className="grid gap-4 p-4">
          {/* immediate feedback banner */}
          {result !== null && fb && (
            <div className={`rounded-card border-[2.5px] border-outline p-3 ${result ? 'bg-mint' : 'bg-yellow'}`}>
              <p className="font-display text-lg font-extrabold">{fb.headline}</p>
              {!fb.ok && (
                <p className="mt-1 text-sm font-bold">
                  <RichText>{fb.body}</RichText>
                </p>
              )}
            </div>
          )}

          <div className="rounded-card border-[2.5px] border-outline bg-sky p-4">
            <p className="text-sm font-extrabold uppercase text-ink/60">{tt(`games.${game.key}.actor`)}</p>
            <p className="mt-2 rounded-2xl border-2 border-outline bg-white p-3 text-xl font-extrabold leading-snug">
              {localize(round.q, lang)}
            </p>
          </div>

          <div className="grid gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (result === null ? submit() : nextRound())}
              disabled={result !== null}
              inputMode={round.type === 'mcq' ? 'text' : 'decimal'}
              placeholder={tt('common.answerPlaceholder')}
              className="min-h-[58px] rounded-full border-[2.5px] border-outline bg-white px-5 text-xl font-extrabold outline-none focus:bg-cream disabled:opacity-80"
            />

            {round.type === 'mcq' && round.options && result === null && (
              <div className="flex flex-wrap gap-2">
                {round.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      playButtonSfx()
                      setInput(opt)
                    }}
                    className={`gb-chip text-base ${input === opt ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {result === null ? (
              <Button color="mint" className="min-h-[58px] text-xl" onClick={submit}>
                {tt(`games.${game.key}.action`)}
              </Button>
            ) : (
              <Button color={result ? 'mint' : 'rose'} className="min-h-[58px] text-xl" onClick={nextRound}>
                {answered >= questions.length ? tt('common.finish') : tt('common.next')}
              </Button>
            )}
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm font-extrabold text-ink/60">
              <span>{tt('common.mastery')}</span>
              <span>{Math.round(score * 100)}%</span>
            </div>
            <MasteryBar score={score} />
          </div>
        </div>
      </Card>
    </div>
  )
}

// Single Online label only — no duplicate at the bottom.
function Header({ online = true }) {
  return (
    <div className="relative z-10 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Mascot size={36} />
        <span className="font-display text-xl font-extrabold">Gabay Games</span>
      </div>
      <OnlineBadge online={online} className="shrink-0" />
    </div>
  )
}

function GameBadges({ game, tt, className = '' }) {
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      {(game.badgeKeys ?? []).map((key) => (
        <span key={key} className="rounded-full border-2 border-outline bg-white px-2 py-1 text-[11px] font-extrabold uppercase leading-none text-ink/70 shadow-hard-sm">
          {tt('games.badge.' + key)}
        </span>
      ))}
    </span>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className={`rounded-card border-[2.5px] border-outline ${color} p-2 text-center`}>
      <p className="font-display text-2xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-xs font-bold text-ink/70">{label}</p>
    </div>
  )
}

// Striped awning shared by every game's start card.
function Awning({ colors }) {
  return (
    <div className="grid h-14 grid-cols-5 overflow-hidden rounded-t-card border-[2.5px] border-outline bg-white">
      {colors.map((color, index) => (
        <span key={index} className={`${color} border-r-2 border-outline last:border-r-0`} />
      ))}
    </div>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 80 80" width="50" height="50" aria-hidden="true">
      <path d="M12 30 L17 14 h46 l5 16 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <rect x="18" y="30" width="44" height="34" rx="3" fill="#A9D8F0" stroke="#1C1410" strokeWidth="4" />
      <rect x="32" y="42" width="16" height="22" fill="#fff" stroke="#1C1410" strokeWidth="4" />
    </svg>
  )
}

function GardenIcon() {
  return (
    <svg viewBox="0 0 80 80" width="50" height="50" aria-hidden="true">
      <path d="M40 46 V66" stroke="#1C1410" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 50 C24 46 20 30 30 22 C44 26 48 42 40 50 Z" fill="#8FD9B6" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 42 C56 38 60 22 50 14 C36 18 32 34 40 42 Z" fill="#8FD9B6" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <path d="M24 66 h32 l-4 8 H28 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 80 80" width="50" height="50" aria-hidden="true">
      <path d="M12 38 L40 14 L68 38 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <rect x="20" y="38" width="40" height="28" fill="#A9D8F0" stroke="#1C1410" strokeWidth="4" />
      <rect x="34" y="48" width="12" height="18" fill="#fff" stroke="#1C1410" strokeWidth="4" />
    </svg>
  )
}

function FiestaIcon() {
  return (
    <svg viewBox="0 0 80 80" width="50" height="50" aria-hidden="true">
      <circle cx="40" cy="42" r="22" fill="#fff" stroke="#1C1410" strokeWidth="4" />
      <path d="M40 42 L40 20 A22 22 0 0 1 61 44 Z" fill="#C9B6F0" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 42 L61 44 A22 22 0 0 1 28 61 Z" fill="#F7D26A" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}
