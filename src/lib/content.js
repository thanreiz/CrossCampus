const loaders = {
  1: () => import('../curriculum/grade1.json', { with: { type: 'json' } }),
  2: () => import('../curriculum/grade2.json', { with: { type: 'json' } }),
  3: () => import('../curriculum/grade3.json', { with: { type: 'json' } }),
  4: () => import('../curriculum/grade4.json', { with: { type: 'json' } }),
  5: () => import('../curriculum/grade5.json', { with: { type: 'json' } }),
  6: () => import('../curriculum/grade6.json', { with: { type: 'json' } }),
}

const cache = new Map()

export async function loadContentByGrade(grade) {
  const key = Number(grade)
  if (!loaders[key]) return []
  if (!cache.has(key)) {
    cache.set(key, loaders[key]().then((module) => {
      cache.set(key, module.default)
      return module.default
    }))
  }
  return await cache.get(key)
}

export function getContentByRef(ref) {
  for (const content of cache.values()) {
    if (Array.isArray(content)) {
      const found = content.find((competency) => competency.ref === ref)
      if (found) return found
    }
  }
  return null
}
