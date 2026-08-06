import { Mascot } from '../ui/Mascot.jsx'
import { makeT } from '../lib/i18n.js'

export default function Generating({ lang = 'taglish' }) {
  const tt = makeT(lang)
  return (
    <div className="gb-shell flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="gabay-idle"><Mascot size={144} /></div>
      <h1 className="mt-5 font-display text-3xl font-extrabold">{tt('questions.generating')}</h1>
      <p className="mt-2 max-w-sm font-bold text-ink/65">{tt('questions.generatingSub')}</p>
      <div className="mt-5 h-3 w-48 overflow-hidden rounded-full border-2 border-outline bg-white">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-mint" />
      </div>
    </div>
  )
}
