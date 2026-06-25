# Gemini Nano (on-device AI) — setup & demo prep

Gabay's tutor tries **on-device Gemini Nano first** (`src/lib/tutor.js`). When it
works, Teacher Gabay answers **fully offline** — the strongest demo moment.
If Nano isn't present the chain silently falls to online Vertex, then to the
cached Taglish explanation. So Nano is a *bonus*, never required.

This is the Chrome **Prompt API** (`window.LanguageModel`). It is gated behind
flags and a one-time model download.

## Requirements
- **Chrome 138+** (desktop). Check `chrome://version`.
- ~**22 GB free disk** (model + headroom) and a non-metered connection for the
  one-time download.
- Integrated/discrete GPU with **>4 GB VRAM** (Nano runs on-device).

## One-time setup
1. Open `chrome://flags`.
2. Enable **Prompt API for Gemini Nano** → `#prompt-api-for-gemini-nano` = **Enabled**.
3. Set **Optimization Guide On Device Model** → `#optimization-guide-on-device-model`
   = **Enabled BypassPerfRequirement**.
4. **Relaunch** Chrome.
5. Open `chrome://components`, find **Optimization Guide On Device Model**, click
   **Check for update**. Wait until a real version number appears (not `0.0.0.0`)
   — this is the ~2 GB model download.

## Verify it's ready (DevTools console, any page)
```js
await LanguageModel.availability()
// "available"   -> ready (Gabay will use Nano offline)
// "downloadable"-> flags ok, model not downloaded yet (do step 5)
// "downloading" -> in progress, wait
// "unavailable" -> device/flags not eligible -> Gabay uses online/cached
```

Quick end-to-end check:
```js
const s = await LanguageModel.create({
  initialPrompts: [{ role: 'system', content: 'You are a Grade 6 math tutor.' }],
})
console.log(await s.prompt('Ano ang 25% ng 80?'))
s.destroy()
```

## Demo prep (airplane-mode proof)
1. Do the one-time setup the night before; confirm `availability() === 'available'`.
2. Load the app once online so the PWA + content precache.
3. Turn on **airplane mode**.
4. In the classroom, tap **Itaas ang kamay**, ask a question by typing.
5. The reply chip should read **"On-device (offline)"** — that's Nano answering
   with no network. (Mic/voice-in stays disabled offline by design.)

## How the code uses it
`src/lib/tutor.js` → `askTeacherGabay()`:
- `nanoAvailable()` checks `'LanguageModel' in self` and `availability() === 'available'`.
- On success the answer is cached as `tutor:{ref}:{hash}` with source `nano`.
- Any failure falls through to `POST /api/tutor` (online), then the cached
  explanation floor — so a missing/again-downloading model never breaks the app.

## Gotchas
- First `create()` after a fresh download can be slow; warm it once before demo.
- Incognito / some enterprise policies disable the Prompt API.
- Flags reset on Chrome channel changes — re-verify after any update.
