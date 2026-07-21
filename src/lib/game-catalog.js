import { isLearnerFacingQuestion } from './question-quality.js'

const THEMES = [
  { outer: 'bg-peach', accent: '#f7d26a', awning: ['bg-rose', 'bg-white', 'bg-yellow', 'bg-white', 'bg-rose'] },
  { outer: 'bg-mint', accent: '#bfe8cf', awning: ['bg-mint', 'bg-white', 'bg-yellow', 'bg-white', 'bg-mint'] },
  { outer: 'bg-sky', accent: '#bfe2f7', awning: ['bg-sky', 'bg-white', 'bg-peach', 'bg-white', 'bg-sky'] },
  { outer: 'bg-lavender', accent: '#ddd0f5', awning: ['bg-lavender', 'bg-white', 'bg-rose', 'bg-white', 'bg-lavender'] },
]

function game(id, iconKey, badgeKeys, refs, themeIndex) {
  return { id, key: id, iconKey, badgeKeys, refs, ...THEMES[themeIndex] }
}

export const GAME_CATALOG_VERSION = 'v2'

export const GAME_CATALOG = {
  1: [
    game('g1-number-train', 'train', ['counting', 'ordering', 'placeValue'], [
      '1NA-Ib-1', '1NA-Ic-1', '1NA-Id-1', '1NA-If-1', '1NA-If-2', '1NA-If-3',
      '1NA-IIa-1', '1NA-IIb-1', '1NA-IIb-2', '1NA-IIc-1',
    ], 0),
    game('g1-sari-sari-shop', 'shop', ['addition', 'subtraction', 'money'], [
      '1NA-If-4', '1NA-Ih-1', '1NA-Ih-2', '1NA-Ii-1', '1NA-IIe-1', '1NA-IIf-1',
      '1NA-IIg-1', '1NA-IIi-1', '1NA-IIi-2', '1NA-IIi-3', '1NA-IIj-1', '1NA-IIj-2',
      '1NA-IIj-3', '1NA-IIIe-1', '1NA-IIIf-1', '1NA-IIIg-1', '1NA-IIIh-1',
    ], 1),
    game('g1-shape-time-playground', 'playground', ['shapes', 'measurement', 'time'], [
      '1MG-Ia-1', '1MG-Ia-2', '1MG-Ia-3', '1MG-Ii-1', '1MG-Ij-1', '1MG-Ij-2',
      '1MG-IIIh-1', '1MG-IIIi-1', '1MG-IIIi-2', '1MG-IIIj-1', '1MG-IIIj-2',
    ], 2),
    game('g1-pattern-picnic', 'picnic', ['patterns', 'fractions', 'data'], [
      '1SP-IIh-1', '1SP-IIh-2', '1SP-IIh-3', '1SP-IIh-4', '1NA-IIIa-1', '1NA-IIIb-1',
      '1NA-IIIc-1', '1NA-IIIc-2', '1NA-IIId-1',
    ], 3),
  ],
  2: [
    game('g2-number-city', 'city', ['counting', 'ordering', 'placeValue'], [
      '2NA-Ic-1', '2NA-Id-1', '2NA-Ie-1', '2NA-If-1', '2NA-If-2', '2NA-Ig-1',
      '2NA-Ig-2', '2NA-IIc-6', '2NA-IIc-7',
    ], 0),
    game('g2-market-math', 'market', ['addition', 'subtraction', 'money'], [
      '2NA-Ih-1', '2NA-Ih-2', '2NA-Ih-3', '2NA-Ii-1', '2NA-Ii-2', '2NA-Ij-1',
      '2NA-Ij-2', '2NA-IIc-1', '2NA-IIc-2', '2NA-IIc-3', '2NA-IIc-4', '2NA-IIc-5',
    ], 1),
    game('g2-sharing-camp', 'camp', ['multiplication', 'division', 'fractions'], [
      '2NA-IIi-1', '2NA-IIj-1', '2NA-IIIa-1', '2NA-IIIb-1', '2NA-IIIb-2', '2NA-IIIc-1',
      '2NA-IIIc-2', '2NA-IIId-1', '2NA-IIId-2', '2NA-IIId-3', '2NA-IIIe-1', '2NA-IIIe-2',
      '2NA-IIIf-1', '2NA-IIIf-2', '2NA-IIIg-1', '2NA-IIIg-2',
    ], 2),
    game('g2-measure-picture-lab', 'ruler-chart', ['measurement', 'data', 'geometry'], [
      '2MG-Ia-1', '2MG-Ia-2', '2MG-Ib-1', '2MG-IIa-1', '2MG-IIa-2', '2MG-IIb-1',
      '2MG-IIb-2', '2SP-IIh-1', '2SP-IIh-2', '2MG-IIIg-1', '2MG-IIIh-1', '2MG-IIIi-1',
      '2MG-IIIi-2', '2MG-IIIi-3', '2MG-IIIj-1', '2MG-IIIj-2',
    ], 3),
  ],
  3: [
    game('g3-number-expedition', 'compass', ['number', 'rounding', 'ordering'], [
      '3NA-Id-1', '3NA-Ie-1', '3NA-If-1', '3NA-Ig-1', '3NA-Ii-1', '3NA-Ii-2', '3NA-Ij-1',
    ], 0),
    game('g3-market-masters', 'basket', ['operations', 'money', 'fractions'], [
      '3NA-IIc-1', '3NA-IIc-2', '3NA-IId-1', '3NA-IId-2', '3NA-IIe-1', '3NA-IIf-1',
      '3NA-IIf-2', '3NA-IIh-1', '3NA-IIIa-1', '3NA-IIIb-1', '3NA-IIIc-1', '3NA-IIIc-2',
      '3NA-IIId-1', '3NA-IIId-2', '3NA-IIId-3', '3NA-IIIe-1', '3NA-IIIf-1', '3NA-IIIf-2',
      '3NA-IIIg-1', '3NA-IIIh-1', '3NA-IIIh-2', '3NA-IIIh-3', '3NA-IIIh-4',
    ], 1),
    game('g3-measure-shape-lab', 'flask-ruler', ['area', 'measurement', 'geometry'], [
      '3MG-Ia-1', '3MG-Ia-2', '3MG-Ib-1', '3MG-Ib-2', '3MG-Ib-3', '3MG-Ic-1',
      '3MG-Ic-2', '3MG-IIa-1', '3MG-IIa-2', '3MG-IIa-3', '3MG-IIb-1', '3MG-IIb-2',
      '3MG-IIb-3', '3MG-IIIi-1', '3MG-IIIj-1', '3MG-IIIj-2',
    ], 2),
    game('g3-data-carnival', 'bar-chart', ['data', 'graphs', 'probability'], [
      '3SP-IIh-1', '3SP-IIi-1', '3SP-IIi-2', '3SP-IIj-1', '3SP-IIj-2',
    ], 3),
  ],
  4: [
    game('g4-big-number-mission', 'rocket', ['number', 'operations', 'patterns'], [
      '4NA-Ie-1', '4NA-Ie-2', '4NA-If-1', '4NA-If-2', '4NA-If-3', '4NA-Ig-1',
      '4NA-Ig-2', '4NA-Ig-3', '4NA-Ii-1', '4NA-Ii-2', '4NA-Ii-3', '4NA-IIa-1',
      '4NA-IIa-2', '4NA-IIIg-1', '4NA-IIIg-2',
    ], 0),
    game('g4-fraction-decimal-kitchen', 'kitchen', ['fractions', 'decimals', 'factors'], [
      '4NA-IIe-1', '4NA-IIe-2', '4NA-IIe-3', '4NA-IIf-1', '4NA-IIg-1', '4NA-IIg-2',
      '4NA-IIh-1', '4NA-IIh-2', '4NA-IIi-1', '4NA-IIi-2', '4NA-IIi-3', '4NA-IIi-4',
      '4NA-IIIa-1', '4NA-IIIb-1', '4NA-IIIc-1', '4NA-IIIg-3', '4NA-IIIg-4', '4NA-IIIi-1',
      '4NA-IIIi-2', '4NA-IIIi-3', '4NA-IIIi-4', '4NA-IIIi-5',
    ], 1),
    game('g4-geometry-workshop', 'tools', ['angles', 'perimeter', 'measurement'], [
      '4MG-Ia-1', '4MG-Ia-2', '4MG-Ib-1', '4MG-Ic-1', '4MG-Ic-2', '4MG-Id-1',
      '4MG-Id-2', '4MG-IIc-1', '4MG-IIc-2', '4MG-IId-1', '4MG-IIId-1', '4MG-IIId-2',
      '4MG-IIId-3',
    ], 2),
    game('g4-data-studio', 'line-chart', ['data', 'graphs', 'time'], [
      '4SP-IIIe-1', '4SP-IIIe-2', '4SP-IIIf-1', '4SP-IIIf-2',
    ], 3),
  ],
  5: [
    game('g5-time-zone-mission', 'globe-clock', ['time', 'conversion', 'world'], [
      '5MG-Ia-1', '5MG-Ia-2', '5MG-Ia-3', '5MG-Ib-1', '5MG-Ib-2',
    ], 0),
    game('g5-fraction-decimal-cafe', 'cafe', ['fractions', 'decimals', 'operations'], [
      '5NA-Ic-1', '5NA-Ic-2', '5NA-Ic-3', '5NA-Ie-1', '5NA-Ih-1', '5NA-Ih-2',
      '5NA-Ii-1', '5NA-Ij-1', '5NA-Ij-2', '5NA-IIa-1', '5NA-IIa-2', '5NA-IIb-1',
      '5NA-IIb-2', '5NA-IIc-1', '5NA-IIIa-1', '5NA-IIIa-2', '5NA-IIIa-3', '5NA-IIIc-1',
      '5NA-IIIc-2', '5NA-IIIc-3', '5NA-IIIe-1',
    ], 1),
    game('g5-data-detective', 'magnifier-chart', ['factors', 'data', 'probability'], [
      '5NA-IId-1', '5NA-IId-2', '5SP-IIf-1', '5SP-IIf-2', '5SP-IIg-1', '5SP-IIg-2',
      '5SP-IIg-3', '5SP-IIi-1', '5SP-IIj-1', '5SP-IIj-2',
    ], 2),
    game('g5-solid-builder', 'blocks', ['geometry', 'area', 'volume'], [
      '5MG-If-1', '5MG-If-2', '5MG-If-3', '5MG-IIIf-1', '5MG-IIIf-2', '5MG-IIIg-1',
      '5MG-IIIg-2', '5MG-IIIh-1', '5MG-IIIh-2', '5MG-IIIi-1', '5MG-IIIi-2', '5MG-IIIj-1',
      '5MG-IIIj-2',
    ], 3),
  ],
  6: [
    game('store', 'shop', ['number', 'percent', 'ratio'], [
      '6NA-Ic-1', '6NA-Ic-2', '6NA-Id-1', '6NA-Id-2', '6NA-Ie-1', '6NA-Ie-2',
      '6NA-If-1', '6NA-If-2', '6NA-If-3', '6NA-Ih-1', '6NA-Ih-2', '6NA-Ii-1',
      '6NA-Ii-2', '6NA-Ii-3', '6NA-Ii-4', '6NA-IIa-1', '6NA-IIa-2', '6NA-IIb-1',
      '6NA-IIc-1', '6NA-IIc-2', '6NA-IId-1', '6NA-IId-2', '6NA-IIe-1', '6NA-IIIi-1',
      '6NA-IIIi-2', '6NA-IIIi-3',
    ], 0),
    game('garden', 'garden', ['geometry', 'area', 'perimeter'], [
      '6MG-IIi-1', '6MG-IIi-2', '6MG-IIj-1', '6MG-IIIa-1', '6MG-IIIa-2', '6MG-IIIb-1',
      '6MG-IIIb-2', '6MG-IIIc-1', '6MG-IIIc-2', '6MG-IIId-1', '6MG-IIId-2', '6MG-IIId-3',
    ], 1),
    game('house', 'house', ['geometry', 'transformation', 'volume'], [
      '6MG-Ia-1', '6MG-Ia-2', '6MG-Ib-1', '6MG-IIf-1', '6MG-IIf-2', '6MG-IIg-1',
      '6MG-IIg-2', '6MG-IIg-3',
    ], 2),
    game('fiesta', 'pie-chart', ['data', 'graphs', 'probability'], [
      '6SP-IIIf-1', '6SP-IIIf-2', '6SP-IIIg-1', '6SP-IIIg-2', '6SP-IIIh-1', '6SP-IIIh-2',
    ], 3),
  ],
}

export function getGamesForGrade(grade) {
  return GAME_CATALOG[Number(grade)] ?? GAME_CATALOG[6]
}

export function validateGameCatalog(catalog, curriculumByGrade, { minimumQuestions = 20 } = {}) {
  const errors = []
  for (let grade = 1; grade <= 6; grade += 1) {
    const games = catalog[grade] ?? []
    const competencies = curriculumByGrade[grade] ?? []
    const known = new Map(competencies.map((competency) => [competency.ref, competency]))
    const assigned = new Map()
    if (games.length !== 4) errors.push(`Grade ${grade} must have exactly four games`)
    for (const entry of games) {
      if (!entry.id || !entry.iconKey || !entry.refs?.length) errors.push(`Grade ${grade} has an incomplete game definition`)
      let questionCount = 0
      for (const ref of entry.refs ?? []) {
        const competency = known.get(ref)
        if (!competency) errors.push(`${entry.id} contains unknown or cross-grade ref ${ref}`)
        else questionCount += (competency.items ?? []).filter(isLearnerFacingQuestion).length
        if (assigned.has(ref)) errors.push(`${ref} is assigned to both ${assigned.get(ref)} and ${entry.id}`)
        assigned.set(ref, entry.id)
      }
      if (questionCount < minimumQuestions) errors.push(`${entry.id} has only ${questionCount} bundled questions`)
    }
    for (const ref of known.keys()) if (!assigned.has(ref)) errors.push(`${ref} is not assigned to a game`)
  }
  return errors
}
