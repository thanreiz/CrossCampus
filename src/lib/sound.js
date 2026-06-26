// Sound: synthesized background music loop + game SFX via Web Audio API.
// No asset files; everything is built from oscillators and works offline.
// Preferences are persisted in IndexedDB to match the app's storage constraint.

import { get, set } from 'idb-keyval'

const MUTED_KEY = 'sound:muted'
const MUSIC_KEY = 'sound:music'
const MUSIC_VOL = 0.16
const STEP_MS = 360

let muted = false
let musicOn = true
let prefsLoaded = false
let ctx = null
let masterGain = null
let musicGain = null
let bgmTimer = null
let bgmStep = 0
let bgmPlaying = false

export async function loadSoundPrefs() {
  if (prefsLoaded) return { muted, musicOn }
  try {
    const [savedMuted, savedMusicOn] = await Promise.all([get(MUTED_KEY), get(MUSIC_KEY)])
    if (typeof savedMuted === 'boolean') muted = savedMuted
    if (typeof savedMusicOn === 'boolean') musicOn = savedMusicOn
  } catch {
    /* IndexedDB unavailable; keep defaults. */
  }
  prefsLoaded = true
  applyGains()
  return { muted, musicOn }
}

function saveFlag(key, val) {
  set(key, val).catch(() => {})
}

function applyGains() {
  if (masterGain) masterGain.gain.value = muted ? 0 : 1
  if (musicGain) musicGain.gain.value = musicOn ? MUSIC_VOL : 0
}

export function primeAudio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)
    musicGain = ctx.createGain()
    musicGain.connect(masterGain)
    applyGains()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(freq, start, dur, { type = 'sine', gain = 0.3, dest = masterGain } = {}) {
  if (!ctx || !dest) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  o.connect(g)
  g.connect(dest)
  o.start(start)
  o.stop(start + dur + 0.03)
}

export function sfx(name) {
  const c = primeAudio()
  if (!c || muted) return
  const t = c.currentTime
  switch (name) {
    case 'correct':
      ;[523.25, 659.25, 783.99].forEach((f, i) => tone(f, t + i * 0.085, 0.18, { type: 'triangle', gain: 0.26 }))
      break
    case 'wrong':
      tone(207.65, t, 0.18, { type: 'sawtooth', gain: 0.18 })
      tone(155.56, t + 0.13, 0.24, { type: 'sawtooth', gain: 0.18 })
      break
    case 'coin':
      tone(987.77, t, 0.07, { type: 'square', gain: 0.16 })
      tone(1318.51, t + 0.07, 0.16, { type: 'square', gain: 0.16 })
      break
    case 'click':
      tone(620, t, 0.06, { type: 'sine', gain: 0.16 })
      break
    case 'finish':
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, t + i * 0.11, 0.26, { type: 'triangle', gain: 0.24 }),
      )
      break
    default:
      break
  }
}

const MELODY = [
  587.33, 0, 783.99, 880, 0, 783.99, 587.33, 0,
  659.25, 0, 880, 987.77, 0, 880, 659.25, 0,
  523.25, 0, 659.25, 783.99, 0, 659.25, 523.25, 0,
  587.33, 783.99, 880, 783.99, 659.25, 587.33, 0, 0,
]

function bgmTick() {
  if (!bgmPlaying || !ctx) return
  const note = MELODY[bgmStep % MELODY.length]
  if (note) {
    const t = ctx.currentTime
    tone(note, t, 0.5, { type: 'sine', gain: 0.5, dest: musicGain })
    tone(note / 2, t, 0.5, { type: 'triangle', gain: 0.28, dest: musicGain })
  }
  bgmStep++
}

export function startBgm() {
  if (bgmPlaying) return
  if (!primeAudio()) return
  bgmPlaying = true
  bgmTick()
  bgmTimer = setInterval(bgmTick, STEP_MS)
}

export function stopBgm() {
  bgmPlaying = false
  if (bgmTimer) {
    clearInterval(bgmTimer)
    bgmTimer = null
  }
}

export function pauseBgm() {
  if (bgmTimer) {
    clearInterval(bgmTimer)
    bgmTimer = null
  }
}

export function resumeBgm() {
  if (bgmPlaying && !bgmTimer) {
    if (!primeAudio()) return
    bgmTimer = setInterval(bgmTick, STEP_MS)
  }
}

export function isMuted() {
  return muted
}

export function toggleMute() {
  muted = !muted
  saveFlag(MUTED_KEY, muted)
  applyGains()
  if (!muted) primeAudio()
  return muted
}

export function isMusicOn() {
  return musicOn
}

export function toggleMusic() {
  musicOn = !musicOn
  saveFlag(MUSIC_KEY, musicOn)
  applyGains()
  return musicOn
}
