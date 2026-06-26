# Gabay Defense Prep

Use this as the team's quick review sheet before judging.

## 30-Second Pitch

Gabay is an offline-first Grade 6 Math study companion for Filipino learners. It combines MATATAG-aligned content, local answer checking, mastery tracking, multilingual support, voice features, a 2D tutor classroom, a 3D classroom simulation, and curriculum mini-games.

The key idea: even if internet is weak or unavailable, the learner can still study, answer, review progress, and practice. AI is an online upgrade, not the core dependency.

## Problem

Many Filipino learners face:

- unstable or expensive internet access
- limited access to tutors
- language barriers when explanations are only in English
- generic learning apps that are not tied to local curriculum

A cloud-only chatbot does not solve this well because the learning loop breaks when connectivity breaks.

## Solution

Gabay keeps the core loop local:

- lessons are bundled in the app
- answers are checked locally
- mastery is stored locally
- games work from bundled content
- progress history is stored locally
- voice has browser fallback
- AI tutor, transcription, and cloud TTS enhance the app when online

## Current Scope

Current scope is intentionally narrow:

- Grade 6
- Mathematics
- DepEd MATATAG-aligned competencies
- mobile-first Progressive Web App
- offline-first learning flow

Do not overclaim that the app already covers every grade, every subject, full LMS analytics, or complete teacher dashboards.

## What Works Offline

After the app has been loaded and cached, these continue to work offline:

- app shell
- lessons
- local answer checking
- mastery tracking
- language preference
- progress history
- mini-games
- 2D classroom flow
- 3D classroom assets if already cached
- browser speech synthesis where supported

## What Needs Internet

These are online upgrades:

- Gemini tutor endpoint
- Gemini Flash transcription
- Google Cloud Text-to-Speech
- Vercel API routes
- first-time app load before cache exists

## AI Used

### Teacher Gabay Tutor

Uses Google Vertex AI / Gemini through `api/tutor.js`.

Default model: `gemini-2.5-pro`, configurable with `GEMINI_MODEL`.

Why:

- tutoring needs reasoning and step-by-step explanation
- the system prompt constrains replies to the current Grade 6 competency
- the tutor can answer in English, Tagalog, or Taglish
- the model is used as a guide, not as the source of assessment truth

### Voice Input / Transcription

Uses Gemini audio understanding through `api/transcribe.js`.

Default model: `gemini-2.5-flash`, configurable with `STT_MODEL`.

Why:

- transcription is not a deep reasoning task
- Flash is better for speed and cost
- audio support helps Tagalog, English, and Taglish voice input
- when unavailable, the app falls back to browser speech or typing

### Voice Output

Uses Google Cloud Text-to-Speech through `api/tts.js`.

Default Filipino voice: `fil-PH-Wavenet-A`, configurable with `TTS_VOICE`.

Why:

- better online voice quality than browser speech
- supports Filipino voice configuration
- browser `speechSynthesis` remains the offline fallback

### Offline AI Path

The app also checks for on-device Gemini Nano through Chrome's `LanguageModel` API when available.

This is optional and not required for the core demo. If unavailable, the app falls back to online Gemini, then cached/local explanations.

## Why Not Other Approaches

### Why not cloud-only AI?

Because the target users may have unstable internet. A cloud-only tutor would fail exactly when students need offline access.

### Why not use AI to generate all questions live?

Assessment needs reliability. Gabay uses bundled curriculum-aligned items so answers can be checked consistently and offline. AI can explain, but the assessment loop stays controlled.

### Why not support every grade already?

The prototype is intentionally focused. Grade 6 Math keeps the scope measurable, reviewable, and defensible for a hackathon build.

### Why not use a full backend database now?

Local mastery is enough for the prototype and supports offline-first usage. Cloud sync, accounts, and teacher dashboards are future scaling features.

### Why not use a physics engine for 3D?

The 3D classroom is for engagement and navigation, not a full simulation game. Procedural Three.js keeps the app lighter, offline-friendly, and easier to cache.

## Architecture Talking Points

- React + Vite powers the frontend.
- Workbox / vite-plugin-pwa handles service worker precaching.
- IndexedDB stores local mastery, preferences, attempts, and cached tutor replies.
- `src/content.json` stores bundled curriculum content.
- `src/lib/check.js` handles local answer checking.
- `src/lib/mastery.js` updates mastery locally.
- Vercel Functions host the AI proxy routes so credentials never ship to the browser.
- Three.js renders the 3D classroom using bundled/procedural assets.

## Limitations To Say Honestly

- Current content is Grade 6 Math only.
- AI tutoring needs internet unless on-device AI is available.
- Voice transcription depends on mic permission, audio quality, and online services.
- Answer checking works best for structured answers, not unlimited open-ended proofs.
- Offline mode works after the app and assets have been loaded/cached.
- It is not a replacement for teachers.
- It does not yet include full student accounts, class rosters, teacher dashboards, or cloud sync.
- The 3D classroom is an engagement prototype, not a full physics simulation.

## Likely Judge Questions

### Is this just ChatGPT with a UI?

No. The core learning loop does not depend on AI. Content, checking, mastery, games, and offline behavior are built into the app. AI is an enhancement layer for tutoring, voice input, and better speech output.

### What happens if there is no internet?

The learner can still study lessons, answer questions, play games, and track mastery. AI tutor, transcription, and cloud TTS degrade to local explanations, typed input, and browser speech where available.

### Why Gemini 2.5 Pro for tutor?

Tutoring needs reasoning, step-by-step explanation, and language control. Pro is a better fit for explanation quality. The app still constrains it with the current competency and keeps assessment local.

### Why Gemini Flash for transcription?

Transcription needs speed and cost efficiency more than deep reasoning. Flash is the better fit for audio transcription.

### Why Google Cloud TTS?

It gives better online voice quality and Filipino voice configuration. The fallback is browser speech synthesis, so voice-out can still work without the cloud service.

### Why Grade 6?

Grade 6 is a clear, measurable scope. It lets the team build a curriculum-grounded prototype instead of a broad generic tutor.

### Why 3D classroom?

It makes the learning flow more engaging for younger learners. It still reuses the same content, answer checker, mastery, and speech systems, so it is not a separate app.

### How do you prevent wrong or random answers?

The app uses local validation and answer checking. Blank answers are blocked, numeric answer prompts require numbers, and submitted answers are checked against known item answers.

### How is mastery computed?

Each competency has a local mastery score. Correct and incorrect attempts update mastery, and the UI uses that score to show progress and topic status.

### How do you protect API keys?

Google credentials live only in Vercel serverless functions. The browser calls `/api/tutor`, `/api/transcribe`, and `/api/tts`; it never receives service-account keys.

## Best Defense Lines

- Gabay is not trying to be the biggest AI tutor. It is trying to be the most usable one for Filipino Grade 6 learners with unstable internet.
- AI is an upgrade, not a dependency.
- The assessment loop is local and reliable; the AI layer explains and supports.
- We chose depth over breadth: one grade, one subject, curriculum-grounded.
- Offline-first is not a bonus feature. It is the product strategy.

## References

- DepEd MATATAG Curriculum: https://www.deped.gov.ph/matatag-curriculum/
- Gemini API Audio Understanding: https://ai.google.dev/gemini-api/docs/audio
- Gemini Models: https://ai.google.dev/gemini-api/docs/models
- Google Cloud Text-to-Speech: https://cloud.google.com/text-to-speech/docs
- Workbox Precaching: https://developer.chrome.com/docs/workbox/modules/workbox-precaching
- Vercel Deployments: https://vercel.com/docs/deployments
