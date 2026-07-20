import { useEffect, useMemo, useState } from 'react'
import { get } from 'idb-keyval'
import { Button, Card, Doodles, MasteryBar, RefBadge, RichText } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { hasAnswered, loadStreak, masteryColor } from '../lib/mastery.js'
import { topicTitle } from '../lib/topics.js'
import { clearHistory, loadHistory } from '../lib/history.js'
import { makeT } from '../lib/i18n.js'

export default function Progress({
  competencies,
  mastery,
  next,
  studentName = '',
  grade = 6,
  online = true,
  lang = 'taglish',
  onPick,
  onChangeGrade,
}) {
  const tt = makeT(lang)
  const [view, setView] = useState('mastery')
  const [sort, setSort] = useState('desc')
  const [history, setHistory] = useState([])
  const [answered, setAnswered] = useState(new Set())
  const [streak, setStreak] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  useEffect(() => {
    Promise.all([
      loadHistory(),
      loadStreak(),
      get('gabay:gamesPlayed'),
      Promise.all(competencies.map(async (c) => [c.ref, await hasAnswered(c.ref, grade)])),
    ]).then(([savedHistory, savedStreak, savedGames, pairs]) => {
      setHistory(savedHistory)
      setStreak(savedStreak)
      setGamesPlayed(savedGames ?? 0)
      setAnswered(new Set(pairs.filter(([, value]) => value).map(([ref]) => ref)))
    })
  }, [competencies, grade, mastery])

  const answeredScores = competencies.filter((c) => answered.has(c.ref)).map((c) => mastery[c.ref] ?? 0)
  const average = answeredScores.length ? answeredScores.reduce((sum, value) => sum + value, 0) / answeredScores.length : 0
  const ordered = useMemo(() => {
    const list = competencies.map((c) => ({ c, s: mastery[c.ref] ?? 0, answered: answered.has(c.ref) }))
    list.sort((a, b) => (sort === 'asc' ? a.s - b.s : b.s - a.s))
    return list
  }, [answered, competencies, mastery, sort])

  const achievements = [
    { key: 'first', earned: answered.size > 0 },
    { key: 'games', earned: gamesPlayed > 0 },
    { key: 'streak', earned: streak >= 3 },
  ]

  async function onClear() {
    await clearHistory()
    setHistory([])
  }

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />

      <Card color="cream" className="relative z-10 mb-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Mascot size={48} />
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-ink/55">{tt('progress.title')}</p>
              <h1 className="truncate font-display text-2xl font-extrabold">{studentName || tt('profile.learner')}</h1>
              <span className="gb-chip mt-1 bg-mint text-xs">{tt('home.grade', { grade })}</span>
            </div>
          </div>
          <OnlineBadge online={online} className="shrink-0" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-extrabold text-ink/60">{tt('profile.overall')}</p>
            <p className="font-display text-4xl font-extrabold">{Math.round(average * 100)}%</p>
          </div>
          <p className="text-right text-sm font-extrabold">{tt('profile.streak', { count: streak })}</p>
        </div>
        <div className="mt-2"><MasteryBar score={average} /></div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {achievements.map((badge) => (
            <div key={badge.key} className={`rounded-card border-2 border-outline p-2 text-center ${badge.earned ? 'bg-yellow' : 'bg-white opacity-45 grayscale'}`}>
              <span className="block text-xl" aria-hidden="true">{badge.earned ? '★' : '○'}</span>
              <span className="block text-[11px] font-extrabold leading-tight">{tt(`achievement.${badge.key}`)}</span>
            </div>
          ))}
        </div>
        <Button color="white" className="mt-4 w-full" onClick={onChangeGrade}>{tt('profile.changeGrade')}</Button>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button onClick={() => setView('mastery')} className={`gb-btn text-base ${view === 'mastery' ? 'bg-yellow' : 'bg-white'}`}>{tt('progress.tab.mastery')}</button>
        <button onClick={() => setView('review')} className={`gb-btn text-base ${view === 'review' ? 'bg-yellow' : 'bg-white'}`}>{tt('progress.tab.review')}</button>
      </div>

      {view === 'mastery' ? (
        <>
          {next && (
            <Card color="yellow" className="gb-pop mb-5 p-4">
              <p className="font-extrabold">{tt('progress.nextUp')}</p>
              <p className="mt-1 text-base font-bold">{topicTitle(next.ref, next.competency)}</p>
              <Button color="white" className="mt-3 w-full text-lg" onClick={() => onPick(next)}>{tt('progress.start')} →</Button>
            </Card>
          )}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-ink/70">{tt('progress.sortBy')}</span>
            <div className="flex gap-2">
              <button onClick={() => setSort('asc')} className={`gb-chip ${sort === 'asc' ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}>{tt('progress.asc')}</button>
              <button onClick={() => setSort('desc')} className={`gb-chip ${sort === 'desc' ? 'bg-sky shadow-hard-sm' : 'bg-white'}`}>{tt('progress.desc')}</button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {ordered.map(({ c, s, answered: isAnswered }) => {
              const color = masteryColor(s)
              return (
                <Card key={c.ref} className="cursor-pointer p-4" role="button" tabIndex={0} onClick={() => onPick(c)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}>
                  <div className="flex items-center justify-between gap-2">
                    <RefBadge refId={c.ref} domain={c.domain} />
                    {isAnswered && <span className={`gb-chip ${color.bg} shadow-hard-sm text-xs`}>{tt('band.' + color.band)}</span>}
                  </div>
                  <p className="mt-2 font-display text-base font-bold leading-snug">{topicTitle(c.ref, c.competency)}</p>
                  {isAnswered && (
                    <div className="mt-2 flex items-center gap-2">
                      <MasteryBar score={s} />
                      <span className="whitespace-nowrap text-sm font-extrabold">{Math.round(s * 100)}%</span>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      ) : <ReviewList history={history} onClear={onClear} tt={tt} />}
    </div>
  )
}

function ReviewList({ history, onClear, tt }) {
  if (!history.length) {
    return <Card color="cream" className="gb-pop p-6 text-center"><p className="font-display text-xl font-extrabold">{tt('progress.empty.title')}</p><p className="mt-2 text-sm font-bold text-ink/70">{tt('progress.empty.sub')}</p></Card>
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between"><span className="text-sm font-extrabold text-ink/70">{tt('progress.yourAnswers')}</span><button className="gb-chip bg-white" onClick={onClear}>{tt('progress.clear')}</button></div>
      {history.map((h, i) => (
        <Card key={i} color={h.correct ? 'mint' : 'rose'} className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2"><RefBadge refId={h.ref} /><span className="gb-chip bg-white text-xs">{h.correct ? tt('common.correct') : tt('common.wrong')}</span></div>
          <div className="rounded-card border-[2.5px] border-outline bg-white p-3 text-base leading-snug">
            <p className="font-bold"><span className="text-ink/60">{tt('common.question')}:</span> {h.q}</p>
            <p className="mt-1.5 font-bold"><span className="text-ink/60">{tt('common.yourAnswer')}:</span> {h.your || '—'}</p>
            <p className="mt-1.5 font-bold"><span className="text-ink/60">{tt('common.correctAnswer')}:</span> {h.answer}</p>
            {h.feedback && <p className="mt-1.5"><span className="font-bold text-ink/60">{tt('common.feedback')}:</span> <RichText>{h.feedback}</RichText></p>}
          </div>
        </Card>
      ))}
    </div>
  )
}
