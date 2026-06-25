import { get, set } from 'idb-keyval'

// Adaptive mastery engine. Per-competency score 0..1 persisted in IndexedDB.
// No localStorage/sessionStorage (constraint). idb-keyval handles offline persistence.

const MASTERY_KEY = 'gabay:mastery'
const QUEUE_KEY = 'gabay:dueAt' // ref -> "due weight"; lower = surfaces sooner
const DEFAULT = 0.5

export async function loadMastery() {
  return (await get(MASTERY_KEY)) ?? {}
}

export async function loadDue() {
  return (await get(QUEUE_KEY)) ?? {}
}

function clamp(n) {
  return Math.max(0, Math.min(1, n))
}

// correct: +0.1. wrong: -0.1 and re-queue sooner (smaller due weight).
export async function recordAnswer(ref, correct) {
  const mastery = await loadMastery()
  const due = await loadDue()

  const prev = mastery[ref] ?? DEFAULT
  mastery[ref] = clamp(prev + (correct ? 0.1 : -0.1))

  // Spaced repetition: a correct answer pushes the item further out,
  // a wrong answer pulls it sooner (re-queue). Tick counter drives ordering.
  const tick = (due._tick ?? 0) + 1
  due._tick = tick
  due[ref] = correct ? tick + 6 : tick + 1

  await set(MASTERY_KEY, mastery)
  await set(QUEUE_KEY, due)
  return mastery[ref]
}

// "What's next?" — lowest mastery, with due-soon as tie-breaker.
export function pickNext(competencies, mastery, due) {
  let best = null
  let bestKey = Infinity
  for (const c of competencies) {
    const m = mastery[c.ref] ?? DEFAULT
    const d = due[c.ref] ?? 0
    // weight mastery heavily; due weight nudges ties
    const key = m * 100 + d * 0.01
    if (key < bestKey) {
      bestKey = key
      best = c
    }
  }
  return best
}

export function masteryLabel(score) {
  const m = score ?? DEFAULT
  if (m >= 0.8) return 'Magaling! 🌟'
  if (m >= 0.6) return 'Mabuti 👍'
  if (m >= 0.4) return 'Kaya pa 💪'
  return 'Simulan natin 🌱'
}
