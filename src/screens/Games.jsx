import { useMemo, useState } from 'react'
import { Card, Button, Doodles, RefBadge, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { checkAnswer } from '../lib/check.js'
import { feedbackFor } from '../lib/feedback.js'
import { recordAttempt } from '../lib/history.js'
import { topicTitle } from '../lib/topics.js'
import { makeT, localize } from '../lib/i18n.js'

const COUNT_OPTIONS = [5, 10, 15, 20]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a question pool from the whole Grade 6 curriculum (every competency's
// items). Repeats the shuffled pool if the learner wants more than we have.
function buildQuestions(competencies, count) {
  const pool = []
  for (const c of competencies) {
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

  const round = questions[idx]
  const done = started && answered >= questions.length
  const score = round?.ref ? mastery[round.ref] ?? 0.5 : 0.5

  function startGame() {
    setQuestions(buildQuestions(competencies, count))
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

  async function submit() {
    if (result !== null || !input.trim()) return
    const locRound = { ...round, q: localize(round.q, lang), solution: localize(round.solution, lang) }
    const ok = checkAnswer(round, input)
    const f = feedbackFor(locRound, ok, lang, idx)
    setResult(ok)
    setFb(f)
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

  // ---- Start screen ----
  if (!started) {
    return (
      <div className="gb-shell relative min-h-screen px-5 pb-28 pt-6">
        <Doodles />
        <Header online={online} />
        <section className="relative z-10 mt-5 overflow-hidden rounded-card border-[2.5px] border-outline bg-peach p-5 shadow-hard">
          <div className="flex min-h-[180px] flex-col justify-end rounded-card border-[2.5px] border-outline bg-[#f7d26a] p-4">
            <ShopAwning />
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight">{tt('games.store')}</h1>
            <p className="mt-1 max-w-[26ch] text-base font-bold text-ink/75">
              {tt('games.tagline')}
            </p>
          </div>
        </section>

        {/* number of questions (5–20) */}
        <div className="mt-5">
          <p className="mb-2 text-base font-extrabold">{tt('games.howMany')}</p>
          <div className="flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`gb-btn flex-1 text-lg ${count === n ? 'bg-mint' : 'bg-white'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs font-bold text-ink/55">{tt('games.minMax')}</p>
        </div>

        <Button color="mint" className="mt-5 min-h-[58px] w-full text-xl" onClick={startGame}>
          {tt('games.startStore', { n: count })}
        </Button>
      </div>
    )
  }

  // ---- Summary ----
  if (done) {
    const correct = log.filter((l) => l.correct).length
    const wrong = log.filter((l) => !l.correct)
    return (
      <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
        <Doodles />
        <Header online={online} />
        <Card color="mint" className="gb-pop mt-6 p-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-card border-[2.5px] border-outline bg-white">
            <ShopIcon />
          </div>
          <h1 className="font-display text-3xl font-extrabold">{tt('games.closed')}</h1>
          <p className="mt-2 text-lg font-extrabold">{tt('games.earned', { coins })}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label={tt('games.answered')} value={log.length} color="bg-sky" />
            <Stat label={tt('common.correct')} value={correct} color="bg-mint" />
            <Stat label={tt('common.wrong')} value={wrong.length} color="bg-rose" />
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
            <p className="text-sm font-extrabold uppercase text-ink/60">{tt('games.customer')}</p>
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
                    onClick={() => setInput(opt)}
                    className={`gb-chip text-base ${input === opt ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {result === null ? (
              <Button color="mint" className="min-h-[58px] text-xl" onClick={submit}>
                {tt('games.pay')}
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

function Stat({ label, value, color }) {
  return (
    <div className={`rounded-card border-[2.5px] border-outline ${color} p-2 text-center`}>
      <p className="font-display text-2xl font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-xs font-bold text-ink/70">{label}</p>
    </div>
  )
}

function ShopAwning() {
  return (
    <div className="grid h-14 grid-cols-5 overflow-hidden rounded-t-card border-[2.5px] border-outline bg-white">
      {['bg-rose', 'bg-white', 'bg-yellow', 'bg-white', 'bg-rose'].map((color, index) => (
        <span key={index} className={`${color} border-r-2 border-outline last:border-r-0`} />
      ))}
    </div>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 80 80" width="62" height="62" aria-hidden="true">
      <path d="M12 30 L17 14 h46 l5 16 Z" fill="#F4A87C" stroke="#1C1410" strokeWidth="4" strokeLinejoin="round" />
      <rect x="18" y="30" width="44" height="34" rx="3" fill="#A9D8F0" stroke="#1C1410" strokeWidth="4" />
      <rect x="32" y="42" width="16" height="22" fill="#fff" stroke="#1C1410" strokeWidth="4" />
    </svg>
  )
}
