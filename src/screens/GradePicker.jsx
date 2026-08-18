import { useState } from 'react'
import { set } from 'idb-keyval'
import { Button } from '../ui/Primitives.jsx'
import { clearMasteryForGrade } from '../lib/mastery.js'
import { makeT } from '../lib/i18n.js'
import './GradePicker.css'

const GRADES = [1, 2, 3, 4, 5, 6]

export default function GradePicker({ currentGrade = 6, lang = 'taglish', onDone, onBack }) {
  const tt = makeT(lang)
  const [pending, setPending] = useState(null)

  async function confirm() {
    await clearMasteryForGrade(currentGrade)
    await set('gabay:selectedGrade', pending)
    onDone?.(pending)
  }

  return (
    <div className="grade-picker-page gb-shell relative min-h-screen">
      <GradePageDecor />

      <header className="grade-picker-header relative z-10">
        <button type="button" className="grade-picker-back" onClick={onBack}>
          <BackIcon />
          <span>{tt('common.back')}</span>
        </button>

        <div className="grade-picker-heading">
          <span className="grade-picker-school" aria-hidden="true"><SchoolIcon /></span>
          <h1>{tt('gradePicker.title')}</h1>
          <p>{tt('gradePicker.subtitle')}</p>
        </div>
      </header>

      <main className="grade-picker-main relative z-10">
        <section className="grade-picker-card" aria-labelledby="grade-picker-title">
          <span id="grade-picker-title" className="sr-only">{tt('gradePicker.title')}</span>

          <div className="grade-picker-grid">
            {GRADES.map((grade) => {
              const isCurrent = grade === currentGrade
              const isSelected = grade === pending
              const stateClass = isCurrent ? 'is-current' : isSelected ? 'is-selected' : 'is-available'

              return (
                <button
                  type="button"
                  key={grade}
                  disabled={isCurrent}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-pressed={isCurrent ? undefined : isSelected}
                  onClick={() => setPending(grade)}
                  className={`grade-picker-grade ${stateClass}`}
                >
                  <strong>{tt('onboarding.gradeLabel', { grade })}</strong>
                  {isSelected && (
                    <span className="grade-picker-state">
                      <CheckCircleIcon />
                      <span>{tt('gradePicker.selected')}</span>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="grade-picker-state">
                      <LockIcon />
                      <span>{tt('gradePicker.current')}</span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {pending !== null && (
            <section className="grade-picker-warning" aria-live="polite" aria-labelledby="grade-warning-title">
              <div className="grade-picker-warning-copy">
                <span className="grade-picker-warning-icon" aria-hidden="true"><WarningIcon /></span>
                <div>
                  <h2 id="grade-warning-title">{tt('gradePicker.confirmTitle', { grade: pending })}</h2>
                  <p>{tt('gradePicker.confirm')}</p>
                </div>
              </div>

              <div className="grade-picker-actions">
                <Button color="mint" className="grade-picker-confirm" onClick={confirm}>
                  <CheckCircleIcon />
                  <span>{tt('gradePicker.yesChange')}</span>
                </Button>
                <Button color="white" className="grade-picker-cancel" onClick={() => setPending(null)}>
                  <XCircleIcon />
                  <span>{tt('gradePicker.noKeep', { grade: currentGrade })}</span>
                </Button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 10v9m0-9 13 4-13 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 31 19-12 19 12v22H13Z" fill="#fff1ad" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 35h8v18H8Zm40 0h8v18h-8ZM25 53V38a7 7 0 0 1 14 0v15M28 29h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="m7.5 12 3 3 6-6.5" fill="none" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.5" y="10.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 10.5V7.8a3 3 0 0 1 6 0v2.7M12 14v2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5 44 40H4Z" fill="#ffd45e" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 17v11m0 6v.5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="m8.5 8.5 7 7m0-7-7 7" fill="none" stroke="#fffdf8" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function GradePageDecor() {
  return (
    <div className="grade-picker-decor" aria-hidden="true">
      <svg viewBox="0 0 430 260" preserveAspectRatio="xMidYMax slice">
        <g className="grade-picker-decor-lines">
          <path d="M24 211 61 145l24 14-37 66Z" />
          <path d="m48 172 18 10m-24 2 18 10m-24 2 18 10" />
          <path d="m322 205 39-34 48 24-35 38Z" />
          <path d="M361 171v62m0-62-39 34m39-34 48 24" />
          <path d="m298 128 34-28 17 38Z" />
          <circle cx="397" cy="119" r="15" />
          <circle cx="55" cy="126" r="14" />
        </g>
        <g className="grade-picker-decor-numbers">
          <text x="92" y="190">1</text>
          <text x="270" y="188">2</text>
          <text x="126" y="242">3</text>
        </g>
        <g className="grade-picker-decor-dots">
          <circle cx="18" cy="100" r="4" />
          <circle cx="78" cy="240" r="3" />
          <circle cx="217" cy="220" r="4" />
          <circle cx="405" cy="245" r="4" />
          <circle cx="245" cy="130" r="3" />
        </g>
      </svg>
    </div>
  )
}
