// Per-attempt review log for "Aking Progreso > Pagsasanay". Stores the question,
// the learner's answer, the correct answer, and feedback — so kids can review
// what happened and how to improve. Persisted offline in IndexedDB (no
// localStorage, per app constraint). Capped so it never grows without bound.

import { get, set } from 'idb-keyval'

const KEY = 'gabay:history'
const CAP = 200

export async function loadHistory() {
  return (await get(KEY)) ?? []
}

// entry: { ref, q, your, answer, correct, feedback, source }
export async function recordAttempt(entry) {
  const h = await loadHistory()
  h.unshift({ ...entry, at: Date.now() })
  await set(KEY, h.slice(0, CAP))
}

export async function clearHistory() {
  await set(KEY, [])
}
