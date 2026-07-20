import { useState } from 'react'
import { set } from 'idb-keyval'
import { Button, Card, Doodles } from '../ui/Primitives.jsx'
import { clearMasteryForGrade } from '../lib/mastery.js'
import { makeT } from '../lib/i18n.js'

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
    <div className="gb-shell relative min-h-screen px-5 py-6">
      <Doodles />
      <button className="gb-chip relative z-10 bg-white" onClick={onBack}>{tt('common.back')}</button>
      <Card color="cream" className="relative z-10 mt-5 p-6 text-center">
        <h1 className="font-display text-3xl font-extrabold">{tt('gradePicker.title')}</h1>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {GRADES.map((grade) => (
            <button
              key={grade}
              disabled={grade === currentGrade}
              onClick={() => setPending(grade)}
              className={`gb-btn text-lg ${grade === currentGrade ? 'bg-mint opacity-70' : pending === grade ? 'bg-yellow' : 'bg-white'}`}
            >
              {tt('onboarding.gradeLabel', { grade })}
            </button>
          ))}
        </div>
        {pending && (
          <div className="mt-5 rounded-card border-[2.5px] border-outline bg-rose p-4">
            <p className="font-extrabold">{tt('gradePicker.confirm')}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button color="mint" onClick={confirm}>{tt('common.yes')}</Button>
              <Button color="white" onClick={() => setPending(null)}>{tt('common.no')}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
