// Serverless ElevenLabs text-to-speech for Voice-OUT (Vercel Function, Node).
// The PWA POSTs { text } here; this returns audio/mpeg bytes for a human-sounding
// Filipino Gabay voice. ONLINE-ONLY — the client falls back to on-device
// speechSynthesis when offline or when this is unconfigured.
//
// Env vars (Vercel Project Settings -> Environment Variables):
//   ELEVENLABS_API_KEY   your ElevenLabs key (server-only, NEVER client)
//   ELEVENLABS_VOICE_ID  voice id to use (a Filipino-capable voice)
//   ELEVENLABS_MODEL     optional, default eleven_multilingual_v2 (supports Filipino)
//
// If the key/voice are unset, returns 501 so the client uses speechSynthesis.

const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  // Not configured — signal client to fall back to speechSynthesis.
  if (!apiKey || !voiceId) return res.status(501).json({ error: 'tts_unconfigured' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const text = (body?.text || '').toString().trim()
  if (!text) return res.status(400).json({ error: 'no_text' })
  // Guard cost/latency — Gabay lines are short; cap hard.
  const clipped = text.slice(0, 800)

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: clipped,
          model_id: MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )

    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      return res.status(502).json({ error: 'tts_failed', status: r.status, detail })
    }

    const buf = Buffer.from(await r.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.status(200).send(buf)
  } catch (err) {
    return res.status(502).json({ error: 'tts_failed', detail: String(err?.message || err) })
  }
}
