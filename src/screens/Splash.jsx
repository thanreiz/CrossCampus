import { Mascot } from '../ui/Mascot.jsx'
import { Button } from '../ui/Primitives.jsx'
import { makeT } from '../lib/i18n.js'

// Splash — design basis: supplied Gabay landing-page reference.
export default function Splash({ onStart, lang = 'taglish' }) {
  const tt = makeT(lang)
  const tagline = lang === 'en' ? 'Your friendly Math tutor!' : 'Ang iyong kaibigang tutor sa Math!'

  return (
    <main className="splash-page">
      <div className="splash-content">
        <div className="splash-mascot-stage" aria-hidden="true">
          <Mascot size={236} className="splash-mascot" float alt="" />
        </div>

        <section className="splash-info-card gb-pop" aria-labelledby="splash-title">
          <span className="splash-card-sparkle" aria-hidden="true">&#10022;</span>
          <h1 id="splash-title" className="splash-title">Gabay</h1>
          <p className="splash-tagline">{tagline}</p>
          <div className="splash-divider" aria-hidden="true">
            <span />
            <b>&#9734;</b>
            <span />
          </div>
          <p className="splash-features">{tt('splash.subtitle')}</p>
        </section>

        <Button color="peach" className="splash-start-button" onClick={onStart}>
          <span>{tt('splash.start')}</span>
          <span className="splash-start-arrow" aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </main>
  )
}
