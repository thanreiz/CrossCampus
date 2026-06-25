import { get, set } from 'idb-keyval'
import content from '../content.json'

// Teacher Gabay tutor — best-available-first fallback chain (build plan §8):
//   1. on-device Gemini Nano (works OFFLINE on capable laptops)
//   2. online -> POST /api/tutor (Vertex/Gemini proxy)
//   3. fully offline, no Nano -> cached Taglish explanation (the floor)
// Every reply is cached in IndexedDB (tutor:{ref}:{hash}) for offline re-reading.
// No language detection — trilingual behavior is the system prompt.

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return (h >>> 0).toString(36)
}

function findCompetency(ref) {
  return content.find((c) => c.ref === ref)
}

// The trilingual system prompt. Inject the active competency so Gabay stays on-curriculum.
export function gabayPrompt(competency) {
  return `You are Teacher Gabay, a friendly Grade 6 math tutor for Filipino learners. The student may write in English, Tagalog, or a Taglish mix — reply in the same style unless they pick a language. Teach using this DepEd MATATAG competency: "${competency}". Use Filipino real-life examples (palengke, jeepney fare, sari-sari store). Never just give the final answer — guide step by step. Keep it short and warm.`
}

// Source of the answer, for UI labelling.
export const SOURCE = { NANO: 'nano', ONLINE: 'online', CACHED: 'cached' }

async function nanoAvailable() {
  try {
    return (
      typeof self !== 'undefined' &&
      'LanguageModel' in self &&
      (await self.LanguageModel.availability()) === 'available'
    )
  } catch {
    return false
  }
}

export async function askTeacherGabay(question, ref) {
  const competency = findCompetency(ref)
  const sysPrompt = gabayPrompt(competency?.competency ?? '')
  const cacheKey = `tutor:${ref}:${hash(question)}`

  const cached = await get(cacheKey)
  if (cached) return { text: cached.text, source: cached.source, fromCache: true }

  // 1. On-device Nano — offline-capable
  if (await nanoAvailable()) {
    try {
      const session = await self.LanguageModel.create({
        initialPrompts: [{ role: 'system', content: sysPrompt }],
      })
      const text = await session.prompt(question)
      session.destroy?.()
      await set(cacheKey, { text, source: SOURCE.NANO })
      return { text, source: SOURCE.NANO, fromCache: false }
    } catch {
      /* fall through */
    }
  }

  // 2. Online — Vertex/Gemini via proxy
  if (navigator.onLine) {
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, ref, system: sysPrompt }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data.text
        await set(cacheKey, { text, source: SOURCE.ONLINE })
        return { text, source: SOURCE.ONLINE, fromCache: false }
      }
    } catch {
      /* fall through */
    }
  }

  // 3. Floor — cached pre-generated Taglish explanation
  const text =
    competency?.explanation?.taglish ??
    'Pasensya, offline tayo at wala pang on-device AI. Basahin muna ang paliwanag sa pisara. 💛'
  return { text, source: SOURCE.CACHED, fromCache: false }
}
