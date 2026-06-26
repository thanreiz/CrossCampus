import { Mascot } from '../ui/Mascot.jsx'
import { Button, Doodles, Sparkle } from '../ui/Primitives.jsx'
import { makeT } from '../lib/i18n.js'

// Splash — design basis: Stitch "Gabay - Splash".
export default function Splash({ onStart, lang = 'taglish' }) {
  const tt = makeT(lang)
  return (
    <div className="gb-shell relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Doodles />

      {/* logo card */}
      <div className="relative gb-pop rounded-card border-[2.5px] border-outline bg-cream p-8 shadow-hard-lg">
        <Sparkle size={26} className="absolute -right-3 -top-3" />
        <div className="flex items-center gap-2">
          <Mascot size={72} float />
          <span className="font-display text-5xl font-extrabold text-yellow [-webkit-text-stroke:2px_#1C1410]">
            Gabay
          </span>
        </div>
      </div>

      <Button color="peach" className="mt-10 px-10 text-lg" onClick={onStart}>
        {tt('splash.start')}
      </Button>
    </div>
  )
}
