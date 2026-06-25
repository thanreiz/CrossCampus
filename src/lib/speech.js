// Voice-OUT: Teacher Gabay reads replies aloud via on-device speechSynthesis.
// Works fully offline. Prefers a Filipino (fil/tl) voice; handles async voice load.

let cachedVoices = []

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  cachedVoices = window.speechSynthesis.getVoices()
}

// Voices often load async — listen for onvoiceschanged.
export function initVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

function pickFilipinoVoice() {
  if (!cachedVoices.length) refreshVoices()
  return (
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('fil')) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('tl')) ||
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('en-ph')) ||
    null
  )
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text) {
  if (!isSpeechSupported() || !text) return
  window.speechSynthesis.cancel() // stop any in-progress utterance
  const u = new SpeechSynthesisUtterance(text)
  const fil = pickFilipinoVoice()
  if (fil) u.voice = fil // else default voice still works
  u.rate = 0.95
  u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
