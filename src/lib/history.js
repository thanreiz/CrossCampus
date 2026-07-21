// Per-attempt review log for "Aking Progreso > Pagsasanay". Stores the question,
// the learner's answer, the correct answer, and feedback — so kids can review
// what happened and how to improve. Persisted offline in IndexedDB (no
// localStorage, per app constraint). Capped so it never grows without bound.

import { get, set } from 'idb-keyval'

const KEY = 'gabay:history'
const CAP = 200
const LEGACY_METADATA_PROMPT = /^(?:which learning task belongs to\s+\S+\??|which goal is aligned with this grade\s+\d+\s+lesson\??)$/i

export function isReviewableAttempt(entry) {
  return Boolean(entry && !LEGACY_METADATA_PROMPT.test(String(entry.q ?? '').trim()))
}

export async function loadHistory() {
  const history = (await get(KEY)) ?? []
  const reviewable = history.filter(isReviewableAttempt)
  if (reviewable.length !== history.length) await set(KEY, reviewable)
  return reviewable
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
