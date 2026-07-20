import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packageRoot = resolve(process.argv[2] || process.env.MATATAG_PACKAGE || '/private/tmp/matatag_parse/DepEd-MATATAG-Mathematics-Grades-1-6')
const manifest = JSON.parse(await readFile(resolve(packageRoot, 'manifest.json'), 'utf8'))
const EXPECTED = [47, 53, 51, 54, 49, 52]

const normalize = (value) => String(value ?? '')
  .replace(/[“”]/g, '"')
  .replace(/’/g, "'")
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\.$/, '')

const localized = (value) => ({ en: value, fil: value, taglish: value })

function section(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`)
  if (start < 0) return ''
  const bodyStart = markdown.indexOf('\n', start) + 1
  const next = markdown.indexOf('\n## ', bodyStart)
  return markdown.slice(bodyStart, next < 0 ? undefined : next).trim()
}

function numbered(body) {
  return [...body.matchAll(/^(\d+)\.\s+(.+)$/gm)].map((match) => ({ number: Number(match[1]), q: match[2].trim() }))
}

function answerKey(markdown) {
  const body = section(markdown, 'Teacher Answer Key')
  const answers = new Map()
  for (const match of body.matchAll(/(?:^-\s*|[;,]\s*)(\d+)-([A-D])(?=\s*[,;]|$)/gm)) answers.set(Number(match[1]), match[2])
  for (const line of body.split('\n')) {
    for (const match of line.matchAll(/(?:^-\s*|;\s*)(\d+)\.\s*(.+?)(?=;\s*\d+\.|$)/g)) {
      const value = match[2].replace(/\s*\(1 point answer, 1 point strategy\)\s*$/, '').trim()
      answers.set(Number(match[1]), value)
    }
  }
  return answers
}

function parseMcq(markdown, keys, source) {
  const body = section(markdown, 'A. Multiple Choice (3 points)')
  const items = []
  const pattern = /^(\d+)\.\s+(.+)\n\s+A\.\s+(.+?)\s+B\.\s+(.+?)\s+C\.\s+(.+?)\s+D\.\s+(.+)$/gm
  for (const match of body.matchAll(pattern)) {
    const number = Number(match[1])
    const labels = ['A', 'B', 'C', 'D']
    const options = match.slice(3, 7).map((value) => value.trim())
    const answer = options[labels.indexOf(keys.get(number))]
    if (!answer) continue
    items.push(makeItem({ q: match[2].trim(), answer, type: 'mcq', options, source, number, originalType: 'multiple-choice' }))
  }
  return items
}

function parseMatching(markdown, keys, source) {
  const body = section(markdown, 'C. Matching Type (2 points)')
  const rows = [...body.matchAll(/^\|\s*(\d+)\.\s*(.+?)\s*\|\s*([A-Z])\.\s*(.+?)\s*\|$/gm)]
  const choices = new Map(rows.map((match) => [match[3], match[4].trim()]))
  return rows.flatMap((match) => {
    const number = Number(match[1])
    const answer = choices.get(keys.get(number))
    if (!answer) return []
    return [makeItem({
      q: match[2].replace(/^Result or description for:\s*/i, '').trim(),
      answer,
      type: 'matching',
      options: [...choices.values()],
      source,
      number,
      originalType: 'matching',
    })]
  })
}

function parseTrueFalse(markdown, keys, source) {
  return numbered(section(markdown, 'D. True or False (2 points)')).flatMap(({ number, q }) => {
    const answer = keys.get(number)
    if (!/^(true|false)$/i.test(answer || '')) return []
    return [makeItem({ q, answer, type: 'true_false', options: ['True', 'False'], source, number, originalType: 'true-false' })]
  })
}

function isObjectivePrompt(question, answer) {
  if (!answer || /answers vary|rubric|partial reasoning/i.test(answer)) return false
  return !/\b(draw|sketch|construct|create|make a model|show or explain|explain your strategy|justify)\b/i.test(question)
}

function parseShortObjective(markdown, keys, source) {
  const candidates = [
    ...numbered(section(markdown, 'B. Identification (2 points)')).map((item) => ({ ...item, originalType: 'identification' })),
    ...numbered(section(markdown, 'E. Computation / Representation (2 points)')).map((item) => ({ ...item, originalType: 'computation' })),
  ].filter(({ number, q }) => isObjectivePrompt(q, keys.get(number)))

  const answerPool = [...new Set(candidates.map(({ number }) => keys.get(number)).filter(Boolean))]
  return candidates.flatMap(({ number, q, originalType }) => {
    const answer = keys.get(number)
    const bareNumeric = /^-?[₱$]?[\d.,/%:+×÷\s-]+$/.test(answer)
    if (bareNumeric) return [makeItem({ q, answer, type: 'numeric', source, number, originalType })]
    const options = [answer, ...answerPool.filter((value) => value !== answer)].slice(0, 4)
    if (options.length < 4) return []
    const shift = number % 4
    return [makeItem({ q, answer, type: 'mcq', options: [...options.slice(shift), ...options.slice(0, shift)], source, number, originalType })]
  })
}

function parseActivity(markdown, source) {
  const keys = new Map([...section(markdown, 'Answer Key').matchAll(/^(\d+)\.\s+(.+)$/gm)].map((match) => [Number(match[1]), match[2].trim()]))
  const prompts = [
    ...numbered(section(markdown, 'Warm-Up')).map((item) => item.q),
    ...numbered(section(markdown, 'Guided Practice')).map((item) => item.q),
    ...numbered(section(markdown, 'Independent Practice')).map((item) => item.q),
    section(markdown, 'Critical Thinking').split('\n')[0],
    section(markdown, 'Real-Life Application').split('\n')[0],
    ...numbered(section(markdown, 'Homework')).map((item) => item.q),
  ]
  const answerPool = [...new Set(keys.values())]
  return prompts.flatMap((q, index) => {
    const number = index + 1
    const answer = keys.get(number)
    if (!q || !isObjectivePrompt(q, answer)) return []
    const itemSource = { ...source, path: source.activity }
    const bareNumeric = /^-?[₱$]?[\d.,/%:+×÷\s-]+$/.test(answer)
    if (bareNumeric) return [makeItem({ q, answer, type: 'numeric', source: itemSource, number, originalType: 'activity' })]
    const options = [answer, ...answerPool.filter((value) => value !== answer)].slice(0, 4)
    if (options.length < 4) return []
    const shift = number % 4
    return [makeItem({ q, answer, type: 'mcq', options: [...options.slice(shift), ...options.slice(0, shift)], source: itemSource, number, originalType: 'activity' })]
  })
}

function makeItem({ q, answer, type, options, source, number, originalType }) {
  const solution = `Answer: ${answer}`
  return {
    q: localized(q),
    answer,
    type,
    ...(options ? { options } : {}),
    solution: localized(solution),
    source: { package: 'DepEd-MATATAG-Mathematics-Grades-1-6', ref: source.reference, path: source.path || source.quiz, item: number, original_type: originalType },
  }
}

function gameTags(spec) {
  if (spec.domain === 'Number and Algebra') return ['store']
  if (/Statistics|Data and Probability/.test(spec.domain)) return ['fiesta']
  const text = `${spec.competency} ${spec.content_standard}`.toLowerCase()
  const measurement = /measure|length|distance|perimeter|area|volume|capacity|mass|time|temperature|money|unit|scale/.test(text)
  const geometry = /shape|triangle|square|rectangle|circle|polygon|angle|line|symmetr|tessell|transform|coordinate|solid|cube|prism/.test(text)
  if (measurement && geometry) return ['garden', 'house']
  return measurement ? ['garden'] : ['house']
}

function firstChallenge(lesson) {
  const activity = section(lesson, 'Activity (15 minutes)')
  return activity.match(/\*\*(.+?)\*\*/)?.[1] || activity.split('\n')[0]
}

for (let grade = 1; grade <= 6; grade++) {
  const specs = (await import(`./specs/grade${grade}.js`)).default
  const rows = manifest.filter((entry) => entry.grade === grade)
  if (rows.length !== EXPECTED[grade - 1] || specs.length !== rows.length) throw new Error(`Grade ${grade}: inventory mismatch`)
  const byCompetency = new Map(rows.map((row) => [normalize(row.competency), row]))
  const output = []

  for (const spec of specs) {
    const row = byCompetency.get(normalize(spec.competency))
    if (!row) throw new Error(`Grade ${grade}: no package entry for ${spec.ref}`)
    const [quiz, lesson, activity] = await Promise.all([
      readFile(resolve(packageRoot, row.quiz), 'utf8'),
      readFile(resolve(packageRoot, row.lesson), 'utf8'),
      readFile(resolve(packageRoot, row.activity), 'utf8'),
    ])
    const keys = answerKey(quiz)
    const source = { ...row, reference: spec.ref, localReference: row.reference }
    const parsedItems = [
      ...parseMcq(quiz, keys, source),
      ...parseShortObjective(quiz, keys, source),
      ...parseMatching(quiz, keys, source),
      ...parseTrueFalse(quiz, keys, source),
      ...parseActivity(activity, source),
    ].sort((a, b) => a.source.item - b.source.item)
    const seenQuestions = new Set()
    const items = parsedItems.filter((item) => {
      const signature = normalize(item.q.en).toLowerCase()
      if (seenQuestions.has(signature)) return false
      seenQuestions.add(signature)
      return true
    })
    if (items.length < 3) throw new Error(`${spec.ref}: only ${items.length} unique objective questions parsed`)
    output.push({
      grade,
      difficulty: grade <= 2 ? 'madali' : grade <= 4 ? 'katamtaman' : 'mahirap',
      ...spec,
      game_tags: gameTags(spec),
      explanation: localized(spec.competency),
      worked_example: localized(firstChallenge(lesson)),
      items,
      source_trace: {
        package: 'DepEd-MATATAG-Mathematics-Grades-1-6',
        local_ref: row.reference,
        activity: row.activity,
        lesson: row.lesson,
        quiz: row.quiz,
      },
    })
  }

  await writeFile(resolve(root, `src/curriculum/grade${grade}.json`), `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Grade ${grade}: ${output.length} competencies, ${output.reduce((sum, entry) => sum + entry.items.length, 0)} objective questions`)
}
