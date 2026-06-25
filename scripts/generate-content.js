// Build-time MATATAG content generator (Featherless, OpenAI-compatible API).
//
// Mass-generates Grade 6 Number & Algebra competencies in the exact content.json
// schema, with trilingual explanations and Filipino-context items. Output is
// written to src/content.generated.json for HUMAN REVIEW — it does NOT overwrite
// the curated src/content.json. Review, fix any math, then merge by hand.
//
//   FEATHERLESS_API_KEY   required (https://featherless.ai, server-only)
//   FEATHERLESS_MODEL     optional, default below (a strong instruct model)
//
// Run:  node --env-file=.env scripts/generate-content.js
//
// To generate more topics, add entries to SPECS below (ref must be unique).

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/content.generated.json')

const BASE_URL = 'https://api.featherless.ai/v1'
const MODEL = process.env.FEATHERLESS_MODEL || 'meta-llama/Meta-Llama-3.1-70B-Instruct'

// Competencies to generate. Provide the curriculum skeleton; the model fills the
// explanation/worked_example/items. Keep refs unique and MATATAG-aligned.
const SPECS = [
  {
    ref: 'G6-NA-PERCENT-04',
    domain: 'Number and Algebra',
    content_standard: 'Percentages, and their relationships with fractions and decimals.',
    competency: 'Solve problems involving finding the base when the percentage and rate are given.',
    performance_standard: 'Work backward from a percentage and rate to recover the whole (base) in real-life contexts.',
  },
  {
    ref: 'G6-NA-RATIO-02',
    domain: 'Number and Algebra',
    content_standard: 'Ratio and proportion.',
    competency: 'Solve problems involving direct proportion using the unit-rate method.',
    performance_standard: 'Apply unit rates to scale quantities up or down in everyday situations.',
  },
]

const SYSTEM = `You are a DepEd MATATAG curriculum writer for Grade 6 Filipino learners.
Return STRICT JSON only — no markdown, no commentary. The student audience is 11-12 years old.
Use Filipino real-life contexts (palengke, sari-sari store, jeepney fare, recipe, school).
Math MUST be correct. Answers must be exact and unambiguous.`

function userPrompt(spec) {
  return `Produce ONE competency object as JSON with EXACTLY these keys:
{
  "ref": "${spec.ref}",
  "domain": "${spec.domain}",
  "content_standard": "${spec.content_standard}",
  "competency": "${spec.competency}",
  "performance_standard": "${spec.performance_standard}",
  "explanation": { "en": "...", "fil": "...", "taglish": "..." },
  "worked_example": "one short Filipino-context worked example",
  "items": [ 5 items ]
}
Each item: { "q": "question in Taglish", "answer": "exact answer as a string", "type": "numeric" | "mcq" }.
For "mcq" items also include "options": [4 strings] that INCLUDES the exact answer.
Keep explanations short and warm. Return ONLY the JSON object.`
}

const REQUIRED_KEYS = [
  'ref', 'domain', 'content_standard', 'competency',
  'performance_standard', 'explanation', 'worked_example', 'items',
]

function validate(obj, spec) {
  const errs = []
  for (const k of REQUIRED_KEYS) if (!(k in obj)) errs.push(`missing "${k}"`)
  if (obj.ref !== spec.ref) errs.push(`ref mismatch (${obj.ref})`)
  for (const l of ['en', 'fil', 'taglish']) {
    if (!obj.explanation?.[l]?.trim()) errs.push(`empty explanation.${l}`)
  }
  if (!Array.isArray(obj.items) || obj.items.length < 1) errs.push('no items')
  obj.items?.forEach((it, i) => {
    if (!it.q?.trim()) errs.push(`item ${i}: empty q`)
    if (it.answer === undefined || String(it.answer).trim() === '') errs.push(`item ${i}: empty answer`)
    if (!['numeric', 'mcq'].includes(it.type)) errs.push(`item ${i}: bad type "${it.type}"`)
    if (it.type === 'mcq') {
      if (!Array.isArray(it.options) || it.options.length < 2) errs.push(`item ${i}: mcq needs options`)
      else if (!it.options.map(String).includes(String(it.answer))) errs.push(`item ${i}: answer not in options`)
    }
  })
  return errs
}

function extractJson(text) {
  // Strip code fences / prose; grab the outermost JSON object.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('no JSON object in response')
  return JSON.parse(raw.slice(start, end + 1))
}

async function generateOne(spec) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt(spec) },
      ],
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Featherless ${res.status}: ${detail.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content ?? ''
  return extractJson(text)
}

async function main() {
  if (!process.env.FEATHERLESS_API_KEY) {
    console.error('Set FEATHERLESS_API_KEY (e.g. node --env-file=.env scripts/generate-content.js)')
    process.exit(1)
  }
  console.log(`Model: ${MODEL}\nGenerating ${SPECS.length} competenc(y/ies)...\n`)

  const out = []
  for (const spec of SPECS) {
    process.stdout.write(`• ${spec.ref} ... `)
    try {
      const obj = await generateOne(spec)
      const errs = validate(obj, spec)
      if (errs.length) {
        console.log(`INVALID:\n    - ${errs.join('\n    - ')}`)
        continue
      }
      out.push(obj)
      console.log('ok')
    } catch (e) {
      console.log(`FAILED: ${e.message}`)
    }
  }

  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`\nWrote ${out.length}/${SPECS.length} to ${OUT}`)
  console.log('REVIEW the math, then merge good entries into src/content.json by hand.')
}

main()
