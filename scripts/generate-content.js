// Build-time MATATAG content generator (Vertex / Gemini).
//
// Mass-generates Grade 6 Number & Algebra competencies in the exact content.json
// schema, with trilingual explanations and Filipino-context items. Output is
// written to src/content.generated.json for HUMAN REVIEW — it does NOT overwrite
// the curated src/content.json. Review, fix any math, then merge by hand.
//
// Reuses the SAME Vertex creds as api/tutor.js (GCP_SA_KEY) — billed to the
// GCP project / $300 credit. No extra vendor.
//
//   GCP_PROJECT, GCP_LOCATION, GCP_SA_KEY   (see .env)
//   GEN_MODEL   optional, default gemini-2.5-flash (cheap, fast, plenty here)
//
// Run:  node --env-file=.env scripts/generate-content.js
//
// To generate more topics, add entries to SPECS below (ref must be unique).

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { GoogleGenAI, Type } from '@google/genai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/content.generated.json')

const LOCATION = process.env.GCP_LOCATION || 'us-central1'
const MODEL = process.env.GEN_MODEL || 'gemini-2.5-flash'

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
The student audience is 11-12 years old. Use Filipino real-life contexts (palengke,
sari-sari store, jeepney fare, recipe, school). Math MUST be correct. Keep explanations
short and warm.

CRITICAL formatting rules:
- "answer" must be a BARE value with NO units, NO currency sign, NO commas, NO words
  (e.g. "300" not "P300" or "300 grams"; "8" not "8 piraso"). The question text may
  state the unit, but the answer field is the plain number/value only.
- For mcq, "options" must be 4 bare values in the same format, INCLUDING the exact answer.
- "taglish" must genuinely MIX Tagalog and English in one flowing voice (code-switching),
  NOT be plain English and NOT identical to the "en" field.`

// Force valid, schema-shaped JSON via responseSchema.
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    explanation: {
      type: Type.OBJECT,
      properties: {
        en: { type: Type.STRING },
        fil: { type: Type.STRING },
        taglish: { type: Type.STRING },
      },
      required: ['en', 'fil', 'taglish'],
    },
    worked_example: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          q: { type: Type.STRING },
          answer: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['numeric', 'mcq'] },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['q', 'answer', 'type'],
      },
    },
  },
  required: ['explanation', 'worked_example', 'items'],
}

function userPrompt(spec) {
  return `Write the teaching content for this DepEd MATATAG competency:
- competency: "${spec.competency}"
- content standard: "${spec.content_standard}"
- performance standard: "${spec.performance_standard}"

Produce a trilingual explanation (en, fil, taglish), one short Filipino-context
worked_example, and EXACTLY 5 practice items. Each item is numeric or mcq; for mcq
include 4 options that contain the exact answer. Questions in Taglish.`
}

// Belt-and-suspenders: strip currency/commas off bare numeric answers so they
// match check.js, which compares against plain student input.
function normNumeric(v) {
  if (typeof v !== 'string') return v
  const stripped = v.replace(/[₱$,]/g, '').trim()
  // Only collapse to the leading number if it's clearly "<number> <unit>".
  const m = stripped.match(/^-?\d+(\.\d+)?/)
  return m && /^-?\d+(\.\d+)?\s+\D/.test(stripped) ? m[0] : stripped
}

function normalize(obj) {
  obj.items?.forEach((it) => {
    if (it.type === 'numeric') it.answer = normNumeric(it.answer)
    if (it.type === 'mcq') {
      it.answer = normNumeric(it.answer)
      if (Array.isArray(it.options)) it.options = it.options.map(normNumeric)
    }
  })
  return obj
}

function validate(obj, spec) {
  const errs = []
  for (const l of ['en', 'fil', 'taglish']) {
    if (!obj.explanation?.[l]?.trim()) errs.push(`empty explanation.${l}`)
  }
  if (obj.explanation?.taglish?.trim() === obj.explanation?.en?.trim()) {
    errs.push('taglish identical to en (not code-switched)')
  }
  if (!obj.worked_example?.trim()) errs.push('empty worked_example')
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

function getCredentials() {
  if (!process.env.GCP_SA_KEY) return null
  try {
    return JSON.parse(process.env.GCP_SA_KEY)
  } catch {
    return null
  }
}

async function generateOne(ai, spec) {
  const result = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: userPrompt(spec) }] }],
    config: {
      systemInstruction: SYSTEM,
      temperature: 0.4,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  })
  const obj = JSON.parse(result.text)
  // Re-attach the curriculum skeleton the model wasn't asked to echo.
  return {
    ref: spec.ref,
    domain: spec.domain,
    content_standard: spec.content_standard,
    competency: spec.competency,
    performance_standard: spec.performance_standard,
    explanation: obj.explanation,
    worked_example: obj.worked_example,
    items: obj.items,
  }
}

async function main() {
  const credentials = getCredentials()
  if (!process.env.GCP_PROJECT || !credentials) {
    console.error('Set GCP_PROJECT + GCP_SA_KEY (node --env-file=.env scripts/generate-content.js)')
    process.exit(1)
  }
  const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.GCP_PROJECT,
    location: LOCATION,
    googleAuthOptions: { credentials },
  })

  console.log(`Model: ${MODEL}\nGenerating ${SPECS.length} competenc(y/ies)...\n`)

  const out = []
  for (const spec of SPECS) {
    process.stdout.write(`• ${spec.ref} ... `)
    try {
      const obj = normalize(await generateOne(ai, spec))
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
