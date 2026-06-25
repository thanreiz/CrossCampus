// Serverless proxy for Teacher Gabay (Vercel Function, Node runtime).
// Kept SEPARATE from the client — this is the ONLY place Vertex/Gemini creds live.
// The PWA POSTs { question, ref, system } here; this returns { text, source }.
//
// Deploy on Vercel: this file at /api/tutor is auto-exposed as POST /api/tutor.
//
// Required Vercel env vars (Project Settings -> Environment Variables):
//   GCP_PROJECT            your Google Cloud project id
//   GCP_LOCATION           region, e.g. us-central1  (optional, defaults below)
//   GCP_SA_KEY             service-account JSON, single-line (stringified)
//   GEMINI_MODEL           optional model override (default gemini-2.5-pro)
// NEVER commit creds. If GCP_PROJECT/GCP_SA_KEY are unset the handler returns a
// curriculum-grounded placeholder so the full client chain stays testable.
//
// Uses the modern Google Gen AI SDK (@google/genai) in Vertex mode — the old
// @google-cloud/vertexai SDK is deprecated (removal June 2026).

import { GoogleGenAI } from '@google/genai'

const LOCATION = process.env.GCP_LOCATION || 'us-central1'
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro'

function getCredentials() {
  // Service-account JSON passed as a single env var string.
  if (!process.env.GCP_SA_KEY) return null
  try {
    return JSON.parse(process.env.GCP_SA_KEY)
  } catch {
    return null
  }
}

let _client = null
function genaiClient() {
  if (_client) return _client
  const project = process.env.GCP_PROJECT
  const credentials = getCredentials()
  if (!project || !credentials) return null
  _client = new GoogleGenAI({
    vertexai: true,
    project,
    location: LOCATION,
    googleAuthOptions: { credentials },
  })
  return _client
}

function placeholder(question, ref, system) {
  return (
    `[PLACEHOLDER proxy reply — set GCP_PROJECT + GCP_SA_KEY to enable Vertex]\n\n` +
    `Tanong mo: "${question}". Para sa competency na ${ref}, tara i-step natin: ` +
    `intindihin muna ang tanong, hanapin ang base/rate, tapos kalkulahin. ` +
    `(System prompt na nakuha: ${system ? 'oo' : 'wala'}.)`
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const { question = '', ref = '', system = '' } = body || {}

  const ai = genaiClient()

  // No creds — return the testable placeholder so Nano -> proxy -> cached chain works.
  if (!ai) {
    return res
      .status(200)
      .json({ text: placeholder(question, ref, system), source: 'placeholder' })
  }

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: question }] }],
      config: {
        ...(system ? { systemInstruction: system } : {}),
        temperature: 0.7,
        // 2.5-pro is a thinking model — thinking tokens count against the budget,
        // so keep headroom or the visible answer can come back empty.
        maxOutputTokens: 2048,
      },
    })
    const text =
      result?.text ??
      result?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ??
      ''
    if (!text) throw new Error('empty completion')
    return res.status(200).json({ text, source: 'vertex' })
  } catch (err) {
    // Surface a 502 so the client falls through to its cached-explanation floor.
    return res
      .status(502)
      .json({ error: 'vertex_failed', detail: String(err?.message || err) })
  }
}
