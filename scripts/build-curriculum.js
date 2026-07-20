import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const reviewed = JSON.parse(await readFile(resolve(root, 'src/content.json'), 'utf8'))
const reviewedByRef = new Map(reviewed.map((entry) => [entry.ref, entry]))

const EXPECTED = [47, 53, 51, 54, 49, 52]

function gameTags(spec) {
  if (spec.domain === 'Number and Algebra') return ['store']
  if (spec.domain === 'Statistics and Probability' || spec.domain === 'Data and Probability') return ['fiesta']
  const text = `${spec.competency} ${spec.content_standard}`.toLowerCase()
  const measurement = /measure|length|distance|perimeter|area|volume|capacity|mass|time|temperature|money|unit|scale/.test(text)
  const geometry = /shape|triangle|square|rectangle|circle|polygon|angle|line|symmetr|tessell|transform|coordinate|solid|cube|prism/.test(text)
  if (measurement && geometry) return ['garden', 'house']
  return measurement ? ['garden'] : ['house']
}

function translations(text) {
  return { en: text, fil: text, taglish: text }
}

function fallbackItems(spec, grade, peers) {
  const other = peers.filter((candidate) => candidate.ref !== spec.ref)
  const starts = Math.max(0, other.findIndex((candidate) => candidate.domain === spec.domain))
  const distractors = Array.from({ length: 15 }, (_, index) => other[(starts + index) % other.length]?.competency).filter(Boolean)
  const prompts = [
    `Which learning task belongs to ${spec.ref}?`,
    `Choose the activity that best matches this lesson: ${spec.content_standard}`,
    `Teacher Gabay is preparing ${spec.ref}. What should learners practise?`,
    `Which goal is aligned with this Grade ${grade} lesson?`,
    `Select the correct description for ${spec.ref}.`,
  ]
  return prompts.map((prompt, index) => {
    const options = [spec.competency, ...distractors.slice(index * 3, index * 3 + 3)]
    const shift = index % 4
    const ordered = [...options.slice(shift), ...options.slice(0, shift)]
    const solution = `The curriculum competency for ${spec.ref} is: ${spec.competency}`
    return {
      q: translations(prompt),
      answer: spec.competency,
      type: 'mcq',
      options: ordered,
      solution: translations(solution),
      source: { package: 'MATATAG Grade 1-6 specifications', ref: spec.ref, kind: 'competency-check' },
    }
  })
}

function lesson(spec, grade, peers) {
  const seed = reviewedByRef.get(spec.ref)
  const keepReviewed = seed && seed.competency === spec.competency
  return {
    grade,
    difficulty: seed?.difficulty ?? (grade <= 2 ? 'madali' : grade <= 4 ? 'katamtaman' : 'mahirap'),
    ...spec,
    game_tags: gameTags(spec),
    explanation: keepReviewed ? seed.explanation : translations(spec.competency),
    worked_example: keepReviewed
      ? seed.worked_example
      : translations(`In this lesson, learners practise: ${spec.competency}`),
    items: keepReviewed
      ? seed.items.map((item, index) => ({
          ...item,
          source: item.source ?? { package: 'reviewed bundled content', ref: spec.ref, item: index + 1 },
        }))
      : fallbackItems(spec, grade, peers),
    source_trace: { package: 'MATATAG Grade 1-6 specifications', ref: spec.ref },
  }
}

await mkdir(resolve(root, 'src/curriculum'), { recursive: true })
for (let grade = 1; grade <= 6; grade++) {
  const specs = (await import(`./specs/grade${grade}.js`)).default
  if (specs.length !== EXPECTED[grade - 1]) throw new Error(`Grade ${grade}: expected ${EXPECTED[grade - 1]}, got ${specs.length}`)
  if (new Set(specs.map((entry) => entry.ref)).size !== specs.length) throw new Error(`Grade ${grade}: duplicate reference`)
  const content = specs.map((spec) => lesson(spec, grade, specs))
  await writeFile(resolve(root, `src/curriculum/grade${grade}.json`), `${JSON.stringify(content, null, 2)}\n`)
  console.log(`Grade ${grade}: ${content.length} competencies, ${content.reduce((sum, entry) => sum + entry.items.length, 0)} questions`)
}
