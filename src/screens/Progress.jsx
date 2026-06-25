import { useEffect, useMemo, useState } from 'react'
import { Card, Doodles, RefBadge, MasteryBar, Button, RichText } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { masteryColor } from '../lib/mastery.js'
import { topicTitle } from '../lib/topics.js'
import { loadHistory, clearHistory } from '../lib/history.js'

// "Aking Progreso" — per-competency mastery overview + a learner-centered
// Pagsasanay review (Question / Your answer / Correct answer / Feedback).
export default function Progress({ competencies, mastery, next, online = true, onPick, onBack }) {
  const [view, setView] = useState('mastery') // 'mastery' | 'review'
  const [sort, setSort] = useState('desc') // 'asc' | 'desc'
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory().then(setHistory)
  }, [])

  const scores = competencies.map((c) => mastery[c.ref] ?? 0.5)
  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)

  const ordered = useMemo(() => {
    const list = competencies.map((c) => ({ c, s: mastery[c.ref] ?? 0.5 }))
    list.sort((a, b) => (sort === 'asc' ? a.s - b.s : b.s - a.s))
    return list
  }, [competencies, mastery, sort])

  async function onClear() {
    await clearHistory()
    setHistory([])
  }

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Mascot size={64} />
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold leading-none">Aking Progreso</h1>
            <p className="text-sm font-bold text-ink/70">Karaniwang mastery: {Math.round(avg * 100)}%</p>
          </div>
        </div>
        <OnlineBadge online={online} className="shrink-0" />
      </div>

      {/* view switch */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setView('mastery')}
          className={`gb-btn text-base ${view === 'mastery' ? 'bg-yellow' : 'bg-white'}`}
        >
          Mastery
        </button>
        <button
          onClick={() => setView('review')}
          className={`gb-btn text-base ${view === 'review' ? 'bg-yellow' : 'bg-white'}`}
        >
          Pagsasanay
        </button>
      </div>

      {/* legend — consistent color meaning everywhere */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-extrabold">
        <span className="flex items-center gap-1.5 rounded-full border-2 border-outline bg-white px-2.5 py-1">
          <span className="h-3 w-3 rounded-full bg-rose" /> Simulan na natin
        </span>
        <span className="flex items-center gap-1.5 rounded-full border-2 border-outline bg-white px-2.5 py-1">
          <span className="h-3 w-3 rounded-full bg-[#f7b955]" /> Kaya pa
        </span>
        <span className="flex items-center gap-1.5 rounded-full border-2 border-outline bg-white px-2.5 py-1">
          <span className="h-3 w-3 rounded-full bg-mint" /> Mabuti
        </span>
      </div>

      {view === 'mastery' ? (
        <>
          {next && (
            <Card color="yellow" className="gb-pop mb-5 p-4">
              <p className="font-extrabold">Susunod na dapat pag-aralan:</p>
              <p className="mt-1 text-base font-bold">{topicTitle(next.ref, next.competency)}</p>
              <Button color="white" className="mt-3 w-full text-lg" onClick={() => onPick(next)}>
                Simulan &rarr;
              </Button>
            </Card>
          )}

          {/* sort filter */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-extrabold text-ink/70">Ayusin ayon sa progreso</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSort('asc')}
                className={`gb-chip ${sort === 'asc' ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
              >
                Pataas
              </button>
              <button
                onClick={() => setSort('desc')}
                className={`gb-chip ${sort === 'desc' ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}
              >
                Pababa
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {ordered.map(({ c, s }) => {
              const color = masteryColor(s)
              return (
                <Card
                  key={c.ref}
                  className="cursor-pointer p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
                  role="button"
                  tabIndex={0}
                  onClick={() => onPick(c)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <RefBadge refId={c.ref} domain={c.domain} />
                    <span className={`gb-chip ${color.bg} shadow-hard-sm text-xs`}>{color.label}</span>
                  </div>
                  <p className="mt-2 font-display text-base font-bold leading-snug">
                    {topicTitle(c.ref, c.competency)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <MasteryBar score={s} />
                    <span className="whitespace-nowrap text-sm font-extrabold">{Math.round(s * 100)}%</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <ReviewList history={history} onClear={onClear} />
      )}
    </div>
  )
}

// Learner-centered review: Tanong -> Sagot mo -> Tamang sagot -> Feedback.
function ReviewList({ history, onClear }) {
  if (!history.length) {
    return (
      <Card color="cream" className="gb-pop p-6 text-center">
        <p className="font-display text-xl font-extrabold">Wala pang pagsasanay</p>
        <p className="mt-2 text-sm font-bold text-ink/70">
          Sagutan ang mga tanong sa Practice o Games — lalabas dito ang review mo.
        </p>
      </Card>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-ink/70">Mga sinagot mo</span>
        <button className="gb-chip bg-white" onClick={onClear}>
          Burahin
        </button>
      </div>
      {history.map((h, i) => (
        <Card key={i} color={h.correct ? 'mint' : 'rose'} className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <RefBadge refId={h.ref} />
            <span className="gb-chip bg-white shadow-hard-sm text-xs">{h.correct ? 'Tama' : 'Mali'}</span>
          </div>
          <div className="rounded-card border-[2.5px] border-outline bg-white p-3 text-base leading-snug">
            <p className="font-bold">
              <span className="text-ink/60">Tanong:</span> {h.q}
            </p>
            <p className="mt-1.5 font-bold">
              <span className="text-ink/60">Sagot mo:</span>{' '}
              <span className={h.correct ? 'text-green-700' : 'text-rose-700'}>{h.your || '—'}</span>
            </p>
            <p className="mt-1.5 font-bold">
              <span className="text-ink/60">Tamang sagot:</span>{' '}
              <span className="text-green-700">{h.answer}</span>
            </p>
            {h.feedback && (
              <p className="mt-1.5">
                <span className="font-bold text-ink/60">Feedback:</span>{' '}
                <RichText>{h.feedback}</RichText>
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
