// Global language preference (English / Filipino / Taglish). The student picks
// once; it drives lesson explanations and Teacher Gabay's reply language.
// Persisted offline in IndexedDB. Default Taglish (the app's house voice).

import { get, set } from 'idb-keyval'

const KEY = 'pref:lang'
export const DEFAULT_LANG = 'taglish'

// key must match content.json explanation.{en,fil,taglish}
export const LANGS = [
  { key: 'taglish', label: 'Taglish' },
  { key: 'fil', label: 'Filipino' },
  { key: 'en', label: 'English' },
]

// Human name used when instructing the tutor what language to reply in.
export const LANG_NAME = {
  en: 'English',
  fil: 'Filipino (Tagalog)',
  taglish: 'Taglish (a natural Tagalog-English mix)',
}

export async function loadLang() {
  const v = await get(KEY)
  return LANGS.some((l) => l.key === v) ? v : DEFAULT_LANG
}

export async function saveLang(lang) {
  if (LANGS.some((l) => l.key === lang)) await set(KEY, lang)
}
