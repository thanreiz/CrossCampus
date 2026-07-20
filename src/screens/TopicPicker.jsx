import { useEffect, useMemo, useState } from 'react'
import { Card, Chip, Doodles, MasteryBar, Button } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import { hasAnswered, masteryColor } from '../lib/mastery.js'
import { topicIcon, topicTitle } from '../lib/topics.js'
import { makeT } from '../lib/i18n.js'

const ICON_BG = ['bg-mint', 'bg-sky', 'bg-rose', 'bg-peach', 'bg-yellow', 'bg-lavender']
const ALL = '__all__'
const DIFFICULTIES = [ALL, 'madali', 'katamtaman', 'mahirap']
const DIFFICULTY_COLOR = { madali: 'bg-mint', katamtaman: 'bg-yellow', mahirap: 'bg-peach' }

export default function TopicPicker({
  competencies,
  mastery,
  due = {},
  grade = 6,
  mode = 'browse',
  online = true,
  lang = 'taglish',
  onPick,
  onBack,
  onBrowse,
}) {
  const tt = makeT(lang)
  const [domain, setDomain] = useState(ALL)
  const [difficulty, setDifficulty] = useState(ALL)
  const [search, setSearch] = useState('')
  const [answered, setAnswered] = useState(new Set())

  useEffect(() => {
    let live = true
    Promise.all(competencies.map(async (c) => [c.ref, await hasAnswered(c.ref, grade)])).then((pairs) => {
      if (live) setAnswered(new Set(pairs.filter(([, value]) => value).map(([ref]) => ref)))
    })
    return () => { live = false }
  }, [competencies, grade, mastery])

  const domains = useMemo(() => [ALL, ...new Set(competencies.map((c) => c.domain))], [competencies])
  const shown = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = competencies.filter((c) => {
      const title = topicTitle(c.ref, c.competency).toLowerCase()
      const practiceMatch = mode !== 'practice' || (answered.has(c.ref) && (mastery[c.ref] ?? 0) < 0.8)
      return practiceMatch &&
        (domain === ALL || c.domain === domain) &&
        (difficulty === ALL || c.difficulty === difficulty) &&
        (!query || title.includes(query) || c.competency.toLowerCase().includes(query))
    })
    if (mode === 'practice') list.sort((a, b) => (due[a.ref] ?? Infinity) - (due[b.ref] ?? Infinity))
    return list
  }, [answered, competencies, difficulty, domain, due, mastery, mode, search])

  const noPracticeDue = mode === 'practice' && !search.trim() && shown.length === 0

  return (
    <div className="gb-shell relative flex min-h-screen flex-col px-5 pb-28 pt-6">
      <Doodles />
      <div className="mb-4 flex items-center justify-between">
        <button className="gb-chip bg-white" onClick={onBack}>{tt('common.back')}</button>
        <div className="flex items-center gap-2">
          <OnlineBadge online={online} />
          <Mascot size={36} />
          <span className="font-display text-xl font-extrabold">Gabay</span>
        </div>
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight">
        {tt(mode === 'practice' ? 'topics.practiceHeading' : 'topics.heading')}
      </h1>
      <p className="mb-4 text-base font-bold text-ink/70">
        {tt(mode === 'practice' ? 'topics.practiceSub' : 'topics.sub')}
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        inputMode="search"
        type="search"
        placeholder={tt('topics.search')}
        aria-label={tt('topics.search')}
        className="relative z-10 mb-4 min-h-[50px] rounded-full border-[2.5px] border-outline bg-white px-5 text-base font-bold outline-none focus:bg-yellow/20"
      />

      <div className="mb-3 flex flex-wrap gap-2">
        {domains.map((value) => (
          <Chip key={value} color="lavender" active={domain === value} onClick={() => setDomain(value)}>
            {value === ALL ? tt('topics.all') : tt(`domain.${value}`)}
          </Chip>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {DIFFICULTIES.map((value) => (
          <Chip key={value} color={value === 'madali' ? 'mint' : value === 'katamtaman' ? 'yellow' : 'peach'} active={difficulty === value} onClick={() => setDifficulty(value)}>
            {value === ALL ? tt('topics.all') : tt(`difficulty.${value}`)}
          </Chip>
        ))}
      </div>

      {noPracticeDue ? (
        <Card color="cream" className="gb-pop p-6 text-center">
          <Mascot size={120} float className="mx-auto" />
          <p className="mt-3 font-display text-xl font-extrabold">{tt('topics.nothingDue')}</p>
          <Button color="mint" className="mt-4 w-full" onClick={onBrowse}>{tt('topics.browseNew')}</Button>
        </Card>
      ) : shown.length === 0 ? (
        <Card color="cream" className="p-6 text-center font-extrabold">{tt('topics.noResults')}</Card>
      ) : (
        <div className="flex flex-col gap-4">
          {shown.map((c, i) => {
            const isAnswered = answered.has(c.ref)
            const score = mastery[c.ref] ?? 0
            const color = masteryColor(score)
            return (
              <Card
                key={c.ref}
                className="gb-pop cursor-pointer p-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm"
                role="button"
                tabIndex={0}
                onClick={() => onPick(c)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(c)}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-outline ${ICON_BG[i % ICON_BG.length]} text-2xl font-extrabold`}>
                    {topicIcon(c.ref)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="min-w-[150px] flex-1 font-display text-lg font-bold leading-tight">{topicTitle(c.ref, c.competency)}</h2>
                      <span className={`gb-chip ${DIFFICULTY_COLOR[c.difficulty] ?? 'bg-white'} shadow-hard-sm text-[11px]`}>
                        {tt(`difficulty.${c.difficulty}`)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-ink/70">{c.competency}</p>
                    {isAnswered && (
                      <div className="mt-2 flex items-center gap-2">
                        <MasteryBar score={score} />
                        <span className={`gb-chip ${color.bg} shrink-0 text-[11px]`}>{Math.round(score * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
