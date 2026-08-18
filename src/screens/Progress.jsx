import { useEffect, useMemo, useState } from 'react'
import { Button, Card, MasteryBar, RichText } from '../ui/Primitives.jsx'
import { Mascot } from '../ui/Mascot.jsx'
import OnlineBadge from '../ui/OnlineBadge.jsx'
import LessonIcon from '../ui/LessonIcon.jsx'
import { LightbulbIcon } from '../ui/Icons.jsx'
import { hasAnswered, loadStreak, masteryColor } from '../lib/mastery.js'
import { topicTitleLocalized } from '../lib/topics.js'
import { clearHistory, loadHistory } from '../lib/history.js'
import { makeT } from '../lib/i18n.js'
import './Progress.css'

const INITIAL_VISIBLE_LESSONS = 3
const isLessonCompleted = (lesson) => Math.round(lesson.s * 100) >= 100

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
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('desc')
  const [history, setHistory] = useState([])
  const [answered, setAnswered] = useState(new Set())
  const [streak, setStreak] = useState(0)
  const [expandedDomains, setExpandedDomains] = useState(new Set())
  const [revealedDomains, setRevealedDomains] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    Promise.all([
      loadHistory(),
      loadStreak(),
      Promise.all(competencies.map(async (c) => [c.ref, await hasAnswered(c.ref, grade)])),
    ]).then(([savedHistory, savedStreak, pairs]) => {
      if (cancelled) return
      setHistory(savedHistory)
      setStreak(savedStreak)
      setAnswered(new Set(pairs.filter(([, value]) => value).map(([ref]) => ref)))
    })
    return () => {
      cancelled = true
    }
  }, [competencies, grade, mastery])

  useEffect(() => {
    const firstDomain = next?.domain || competencies[0]?.domain
    setExpandedDomains(firstDomain ? new Set([firstDomain]) : new Set())
  }, [competencies, grade, next?.domain])

  useEffect(() => {
    setRevealedDomains(new Set())
  }, [competencies, filter, grade])

  const answeredScores = competencies.filter((c) => answered.has(c.ref)).map((c) => mastery[c.ref] ?? 0)
  const average = answeredScores.length ? answeredScores.reduce((sum, value) => sum + value, 0) / answeredScores.length : 0
  const lessonItems = useMemo(
    () => competencies.map((c) => ({ c, s: mastery[c.ref] ?? 0, answered: answered.has(c.ref) })),
    [answered, competencies, mastery],
  )
  const ordered = useMemo(() => {
    const list = lessonItems.filter((lesson) => {
      if (filter === 'started') return lesson.s > 0 && !isLessonCompleted(lesson)
      if (filter === 'completed') return isLessonCompleted(lesson)
      return true
    })
    list.sort((a, b) => (sort === 'asc' ? a.s - b.s : b.s - a.s))
    return list
  }, [filter, lessonItems, sort])
  const groups = useMemo(() => {
    const byDomain = new Map()
    for (const item of lessonItems) {
      const domain = item.c.domain || 'Math Lessons'
      if (!byDomain.has(domain)) byDomain.set(domain, { allLessons: [], lessons: [] })
      byDomain.get(domain).allLessons.push(item)
    }
    for (const item of ordered) {
      const domain = item.c.domain || 'Math Lessons'
      byDomain.get(domain).lessons.push(item)
    }
    return Array.from(byDomain, ([domain, value]) => ({ domain, ...value })).filter((group) => group.lessons.length)
  }, [lessonItems, ordered])

  useEffect(() => {
    const visibleDomains = new Set(groups.map((group) => group.domain))
    setExpandedDomains((current) => {
      if (Array.from(current).some((domain) => visibleDomains.has(domain))) return current
      return groups[0]?.domain ? new Set([groups[0].domain]) : new Set()
    })
  }, [groups])

  const achievements = [
    { key: 'first', earned: answered.size > 0, locked: false },
    { key: 'games', earned: false, locked: true },
    { key: 'streak', earned: false, locked: true },
  ]
  const nextTitle = next ? topicTitleLocalized(next.ref, next.competency, lang) : ''
  const nextStarted = next ? (mastery[next.ref] ?? 0) > 0 : false

  async function onClear() {
    await clearHistory()
    setHistory([])
  }

  function toggleDomain(domain) {
    setExpandedDomains((current) => {
      const nextExpanded = new Set(current)
      if (nextExpanded.has(domain)) nextExpanded.delete(domain)
      else nextExpanded.add(domain)
      return nextExpanded
    })
  }

  function toggleDomainLessons(domain) {
    setRevealedDomains((current) => {
      const nextRevealed = new Set(current)
      if (nextRevealed.has(domain)) nextRevealed.delete(domain)
      else nextRevealed.add(domain)
      return nextRevealed
    })
  }

  return (
    <main className="profile-page gb-shell">
      <section className="profile-summary gb-card" aria-labelledby="profile-name">
        <div className="profile-identity-row">
          <div className="profile-identity">
            <div className="profile-avatar-frame">
              <Mascot size={72} alt="Nova" />
            </div>
            <div className="profile-name-block">
              <p className="profile-eyebrow">{tt('progress.title')}</p>
              <h1 id="profile-name">{studentName || tt('profile.learner')}</h1>
              <span className="gb-chip profile-grade-chip">{tt('home.grade', { grade })}</span>
            </div>
          </div>
          <OnlineBadge online={online} className="profile-online-badge" />
        </div>

        <div className="profile-mastery-heading">
          <div>
            <p>{tt('profile.overall')}</p>
            <strong>{Math.round(average * 100)}%</strong>
          </div>
          <p className="profile-streak">{tt('profile.streak', { count: streak })}</p>
        </div>
        <div
          className="profile-overall-bar"
          role="progressbar"
          aria-label={tt('profile.overall')}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(average * 100)}
        >
          <MasteryBar score={average} />
        </div>

        <div className="profile-achievements" aria-label="Achievements">
          {achievements.map((badge) => (
            <div
              key={badge.key}
              className={'profile-achievement ' + (badge.earned ? 'is-earned ' : '') + (badge.locked ? 'is-locked' : '')}
              aria-label={tt('achievement.' + badge.key) + (badge.locked ? ', ' + tt('progress.locked') : '')}
            >
              {badge.locked ? <LockIcon /> : <StarIcon filled={badge.earned} />}
              <span>{tt('achievement.' + badge.key)}</span>
            </div>
          ))}
        </div>

        <Button color="white" className="profile-change-grade" onClick={onChangeGrade}>
          {tt('profile.changeGrade')}
        </Button>
      </section>

      {view === 'mastery' && next && (
        <Card color="yellow" className="profile-next-card gb-pop">
          <TopicArtwork lesson={next} title={nextTitle} />
          <div className="profile-next-main">
            <div className="profile-next-copy">
              <p>{tt('progress.nextUp')}</p>
              <h2>{nextTitle}</h2>
            </div>
            <Button color="white" className="profile-next-button" onClick={() => onPick(next)}>
              {tt(nextStarted ? 'progress.continue' : 'progress.start')} <ArrowIcon />
            </Button>
          </div>
        </Card>
      )}

      <div className="profile-view-tabs" role="tablist" aria-label={tt('progress.title')}>
        <button type="button" role="tab" aria-selected={view === 'mastery'} onClick={() => setView('mastery')} className={view === 'mastery' ? 'is-active' : ''}>
          {tt('progress.tab.mastery')}
        </button>
        <button type="button" role="tab" aria-selected={view === 'review'} onClick={() => setView('review')} className={view === 'review' ? 'is-active' : ''}>
          {tt('progress.tab.review')}
        </button>
      </div>

      {view === 'mastery' ? (
        <section className="profile-lessons" aria-labelledby="profile-lessons-title">
          <h2 id="profile-lessons-title">{tt('progress.lessonsHeading')}</h2>
          <div className="profile-filter-tabs" role="group" aria-label={tt('progress.filterLabel')}>
            {['all', 'started', 'completed'].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={filter === value}
                className={filter === value ? 'is-active' : ''}
                onClick={() => setFilter(value)}
              >
                {tt('progress.filter.' + value)}
              </button>
            ))}
          </div>
          <div className="profile-sort-row">
            <span>{tt('progress.sortBy')}</span>
            <div className="profile-sort-buttons">
              <button type="button" onClick={() => setSort('asc')} className={sort === 'asc' ? 'is-active' : ''}>
                <SortArrowIcon direction="up" />
                <span>{tt('progress.asc')}</span>
              </button>
              <button type="button" onClick={() => setSort('desc')} className={sort === 'desc' ? 'is-active' : ''}>
                <span>{tt('progress.desc')}</span>
                <SortArrowIcon direction="down" />
              </button>
            </div>
          </div>

          <div className="profile-domain-list">
            {!groups.length && (
              <Card color="cream" className="profile-filter-empty">
                <strong>{tt('progress.filterEmptyTitle')}</strong>
                <span>{tt('progress.filterEmptyBody')}</span>
              </Card>
            )}
            {groups.map(({ domain, lessons, allLessons }) => {
              const expanded = expandedDomains.has(domain)
              const revealed = revealedDomains.has(domain)
              const localizedDomain = tt('domain.' + domain)
              const domainLabel = localizedDomain.startsWith('domain.') ? domain : localizedDomain
              const completed = allLessons.filter(isLessonCompleted).length
              const domainScore = allLessons.length
                ? allLessons.reduce((sum, lesson) => sum + lesson.s, 0) / allLessons.length
                : 0
              const visibleLessons = revealed ? lessons : lessons.slice(0, INITIAL_VISIBLE_LESSONS)
              const hiddenCount = Math.max(0, lessons.length - INITIAL_VISIBLE_LESSONS)

              return (
                <article key={domain} className={'profile-domain-card ' + (expanded ? 'is-expanded' : '')}>
                  <button type="button" className="profile-domain-toggle" onClick={() => toggleDomain(domain)} aria-expanded={expanded}>
                    <DomainArtwork domain={domain} />
                    <span className="profile-domain-copy">
                      <strong>{domainLabel}</strong>
                      <small>{tt('progress.completedCount', { completed, total: allLessons.length })}</small>
                      <span
                        className="profile-domain-progress"
                        role="progressbar"
                        aria-label={domainLabel + ' ' + tt('common.mastery')}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={Math.round(domainScore * 100)}
                      >
                        <MasteryBar score={domainScore} />
                      </span>
                    </span>
                    <ChevronIcon expanded={expanded} />
                  </button>

                  {expanded && (
                    <div className="profile-domain-lessons">
                      {visibleLessons.map(({ c, s }) => {
                        const color = masteryColor(s)
                        const recommended = next?.ref === c.ref
                        const completedLesson = isLessonCompleted({ s })
                        const startedLesson = s > 0 && !completedLesson
                        const pct = Math.round(s * 100)
                        const lessonTitle = topicTitleLocalized(c.ref, c.competency, lang)
                        const actionLabel = recommended
                          ? tt(startedLesson ? 'progress.continue' : 'progress.start')
                          : tt(completedLesson ? 'progress.reviewLesson' : startedLesson ? 'progress.continue' : 'progress.start')
                        return (
                          <button
                            type="button"
                            key={c.ref}
                            className={'profile-lesson-row ' + (recommended ? 'is-recommended ' : '') + (completedLesson ? 'is-completed' : '')}
                            onClick={() => onPick(c)}
                          >
                            <LessonArtwork lesson={c} title={lessonTitle} />
                            <span className="profile-lesson-copy">
                              <strong>{lessonTitle}</strong>
                              {recommended && <span className="profile-recommended-chip">{tt('progress.recommended')}</span>}
                              {!recommended && (
                                <small>
                                  {completedLesson
                                    ? tt('progress.completed')
                                    : startedLesson
                                      ? tt('progress.lessonProgress', { pct })
                                      : tt('progress.notStarted')}
                                </small>
                              )}
                              {s > 0 && (
                                <span
                                  className="profile-lesson-progress"
                                  role="progressbar"
                                  aria-label={lessonTitle + ' ' + tt('common.mastery')}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  aria-valuenow={pct}
                                >
                                  <MasteryBar score={s} />
                                  <b>{pct}%</b>
                                </span>
                              )}
                            </span>
                            <span className={'profile-lesson-action ' + (recommended ? 'is-primary' : '')}>
                              {actionLabel}
                            </span>
                            {s > 0 && <span className={'profile-band-dot ' + color.bg} aria-hidden="true" />}
                          </button>
                        )
                      })}
                      {lessons.length > INITIAL_VISIBLE_LESSONS && (
                        <button
                          type="button"
                          className="profile-show-more"
                          aria-expanded={revealed}
                          onClick={() => toggleDomainLessons(domain)}
                        >
                          {revealed ? tt('progress.showLess') : tt('progress.showMore', { count: hiddenCount })}
                          <ChevronIcon expanded={revealed} />
                        </button>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      ) : (
        <ReviewList history={history} competencies={competencies} onClear={onClear} tt={tt} />
      )}
    </main>
  )
}

function ReviewList({ history, competencies = [], onClear, tt }) {
  if (!history.length) {
    return (
      <Card color="cream" className="profile-empty-review gb-pop">
        <p>{tt('progress.empty.title')}</p>
        <span>{tt('progress.empty.sub')}</span>
      </Card>
    )
  }
  const competencyByRef = new Map(competencies.map((competency) => [competency.ref, competency]))

  return (
    <section className="profile-review-list">
      <div className="profile-review-heading">
        <span>{tt('progress.yourAnswers')}</span>
        <button type="button" onClick={onClear}>{tt('progress.clear')}</button>
      </div>
      {history.map((h, i) => {
        const domain = competencyByRef.get(h.ref)?.domain || reviewDomainFromRef(h.ref)
        const translatedDomain = tt('domain.' + domain)
        const category = translatedDomain.startsWith('domain.') ? domain : translatedDomain

        return (
          <Card
            key={h.ref + '-' + i}
            color="cream"
            className={'profile-review-card ' + (h.correct ? 'is-correct' : 'is-incorrect')}
          >
            <div className="profile-review-meta">
              <span className="profile-review-category">
                <ReviewCategoryIcon />
                <span>{category}</span>
              </span>
              <span className="profile-review-result">
                <ReviewResultIcon correct={h.correct} />
                <span>{h.correct ? tt('common.correct') : tt('common.wrong')}</span>
              </span>
            </div>

            <div className="profile-review-question">
              <span>{tt('common.question')}</span>
              <p><RichText>{h.q}</RichText></p>
            </div>

            <div className="profile-review-divider" aria-hidden="true" />

            <div className="profile-review-answers">
              <div className="profile-review-answer-panel">
                <span>{tt('common.yourAnswer')}</span>
                <p><RichText>{h.your || '—'}</RichText></p>
              </div>
              <div className="profile-review-answer-panel">
                <span>{tt('common.correctAnswer')}</span>
                <p><RichText>{h.answer}</RichText></p>
              </div>
            </div>

            {h.feedback && (
              <div className="profile-review-feedback">
                <span className="profile-review-feedback-icon" aria-hidden="true">
                  <LightbulbIcon size={23} />
                </span>
                <div>
                  <span>{tt('common.feedback')}</span>
                  <p><RichText>{h.feedback}</RichText></p>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </section>
  )
}

function reviewDomainFromRef(ref = '') {
  if (/^\d*MG/i.test(ref)) return 'Measurement and Geometry'
  if (/^\d*SP/i.test(ref)) return 'Statistics and Probability'
  return 'Number and Algebra'
}

function ReviewCategoryIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="4" y="3" width="12" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 6h6M7 9h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ReviewResultIcon({ correct }) {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      {correct
        ? <path d="m6.5 10 2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="m7.3 7.3 5.4 5.4m0-5.4-5.4 5.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  )
}

function TopicArtwork({ lesson, title }) {
  return (
    <div className="profile-topic-art" aria-hidden="true">
      <LessonIcon
        refId={lesson.ref}
        title={title}
        competency={lesson.competency}
        domain={lesson.domain}
        size={52}
      />
    </div>
  )
}

function DomainArtwork({ domain = '' }) {
  return <span className="profile-domain-art" aria-hidden="true"><DomainGlyph domain={domain} size={42} /></span>
}

function LessonArtwork({ lesson, title }) {
  const palette = /SP|DP/.test(lesson.ref) ? 'rose' : /MG/.test(lesson.ref) ? 'mint' : 'yellow'
  return (
    <span className={'profile-lesson-art is-' + palette} aria-hidden="true">
      <LessonIcon
        refId={lesson.ref}
        title={title}
        competency={lesson.competency}
        domain={lesson.domain}
        size={28}
      />
    </span>
  )
}

function DomainGlyph({ domain = '', size = 36 }) {
  if (/probability|statistics|data/i.test(domain)) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <path d="M9 38V25h7v13M21 38V13h7v25M33 38V20h7v18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M6 39h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (/measurement|geometry/i.test(domain)) {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <path d="M8 39 23 9l17 30Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="m15 33 15-1-9-11Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <path d="M9 18h30M9 31h30M19 9l-4 30M33 9l-4 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 32 32" width="27" height="27" aria-hidden="true">
      <path d="m16 3 3.8 8 8.7 1.1-6.4 6 1.7 8.6-7.8-4.2-7.8 4.2 1.7-8.6-6.4-6 8.7-1.1Z" fill={filled ? '#1c1410' : 'none'} stroke="#1c1410" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 32 32" width="27" height="27" aria-hidden="true">
      <rect x="7" y="14" width="18" height="14" rx="3" fill="#8b8175" stroke="#1c1410" strokeWidth="2.5" />
      <path d="M11 14V10a5 5 0 0 1 10 0v4" fill="none" stroke="#1c1410" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="20" r="1.7" fill="#fff" />
      <path d="M16 21v3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ expanded = false }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" className={'profile-chevron ' + (expanded ? 'is-expanded' : '')} aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
      <path d="M4 12h15m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SortArrowIcon({ direction = 'up' }) {
  const down = direction === 'down'
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d={down ? 'M12 4v16m-6-6 6 6 6-6' : 'M12 20V4m-6 6 6-6 6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
