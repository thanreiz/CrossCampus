// Floating sound on/off button. Sits just above the bottom nav so it's
// reachable from every tabbed screen. Toggles the master mute (music + SFX).
import { useEffect, useState } from 'react'
import { isMuted, loadSoundPrefs, toggleMute, sfx } from '../lib/sound.js'

export default function SoundToggle() {
  const [muted, setMuted] = useState(isMuted())

  useEffect(() => {
    let alive = true
    loadSoundPrefs().then((prefs) => {
      if (alive) setMuted(prefs.muted)
    })
    return () => {
      alive = false
    }
  }, [])

  function onClick() {
    const next = toggleMute()
    setMuted(next)
    if (!next) sfx('click') // little confirmation when turning sound back on
  }

  return (
    <button
      onClick={onClick}
      aria-label={muted ? 'Buksan ang tunog' : 'Patayin ang tunog'}
      aria-pressed={muted}
      className="fixed bottom-[88px] right-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-outline bg-white shadow-hard-sm active:translate-y-0.5"
    >
      {muted ? <MutedIcon /> : <SoundIcon />}
    </button>
  )
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M4 9 h3 l4 -3 v12 l-4 -3 H4 Z" fill="#1C1410" stroke="#1C1410" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 9 a4 4 0 0 1 0 6 M17.5 7 a7 7 0 0 1 0 10" fill="none" stroke="#1C1410" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M4 9 h3 l4 -3 v12 l-4 -3 H4 Z" fill="#1C1410" stroke="#1C1410" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 9 l5 6 M20 9 l-5 6" fill="none" stroke="#1C1410" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
