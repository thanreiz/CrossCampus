# Gabay

<p align="center">
  <img src="public/mascot.svg" alt="Teacher Gabay mascot" width="120" />
</p>

<p align="center">
  <img alt="Team GANGG" src="https://img.shields.io/badge/Team-GANGG-F7D26A?style=for-the-badge&labelColor=1C1410" />
  <img alt="Offline First" src="https://img.shields.io/badge/Offline--First-PWA-8FD9B6?style=for-the-badge&labelColor=1C1410" />
  <img alt="Grade 6 Math" src="https://img.shields.io/badge/Grade_6-Math_Aide-A9D8F0?style=for-the-badge&labelColor=1C1410" />
  <img alt="React" src="https://img.shields.io/badge/React_19-Study_App-61DAFB?style=for-the-badge&labelColor=1C1410" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-3D_Classroom-F4C3D0?style=for-the-badge&labelColor=1C1410" />
</p>

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="IndexedDB" src="https://img.shields.io/badge/IndexedDB-Mastery_Storage-F4A87C?style=flat-square" />
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini-AI_Tutor-8E75FF?style=flat-square" />
  <img alt="Vercel Ready" src="https://img.shields.io/badge/Vercel-Ready-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

> An offline-first AI study companion for Grade 6 Filipino learners, built by **Team GANGG** for hackathon demo day.

Gabay helps Grade 6 students practice Math even when internet access is weak or unavailable. It combines curriculum-grounded lessons, adaptive mastery tracking, voice support, a 2D classroom tutor, a 3D classroom simulation, and a Tindahan math game inside one mobile-first Progressive Web App.

## Team

**Group Name:** Team GANGG

| Member | Role |
| --- | --- |
| Member 1 | Product / Research |
| Member 2 | Frontend / UI |
| Member 3 | AI / Backend |
| Member 4 | Demo / QA |

> Replace the member rows with the final submitted names before judging.

## The Problem

Many Filipino learners study in places where internet access is inconsistent. Most AI study tools assume a stable connection, accounts, cloud-only inference, and generic content. That makes them fragile for real classroom and home study use.

Gabay is designed around a stricter requirement: the core learning loop must still work offline.

## Our Solution

Gabay is a React + Vite PWA that teaches **Grade 6 Number and Algebra** using DepEd MATATAG-aligned content. Students can open lessons, hear Teacher Gabay read explanations, answer practice questions, build mastery, enter a 3D classroom, and play a store-themed math game.

When online, Gabay can use richer AI services for tutoring, transcription, and cloud text-to-speech. When offline, it falls back to bundled lessons, cached responses, browser speech synthesis, and IndexedDB mastery data.

## Demo Flow

1. Open Gabay and enter the hallway.
2. Choose a lesson from **Mga Aralin** or browse topics.
3. Read the lesson brief and enter either **2D Klase** or **3D Klase**.
4. Answer blackboard questions and watch mastery update.
5. Turn the network off and reload the app.
6. Continue studying offline: lessons, practice, mastery, voice-out fallback, and games still work.

## Key Features

- **Offline-first PWA**: service worker precaches the app shell, lesson content, icons, styles, and bundled chunks.
- **Curriculum-grounded content**: Grade 6 Number and Algebra competencies in `src/content.json`.
- **Adaptive mastery**: per-competency mastery scores persist in IndexedDB and guide the next lesson.
- **Teacher Gabay tutor**: short, friendly explanations in English, Filipino, and Taglish.
- **Voice-out**: online Google Cloud TTS when configured, offline browser speech synthesis fallback.
- **Voice-in**: online mic transcription through Gemini STT with Web Speech fallback.
- **2D classroom**: chalkboard tabs, examples, practice, answer checking, and ask-teacher panel.
- **3D classroom**: procedural Three.js classroom with WASD/touch controls, blackboard questions, proximity interaction, and cleanup on exit.
- **Tindahan Game**: Filipino store scenario game for decimals, percentage, discounts, ratios, and percent conversion.
- **Mobile-first UI**: built for 360px screens with large tap targets and persistent bottom navigation.

## What Makes It Hackathon-Worthy

Gabay is not just a chatbot wrapper. It is a complete learning loop with a clear offline-first constraint:

- The content is bundled, not fetched at runtime.
- Answer checking uses local logic in `src/lib/check.js`.
- Mastery tracking uses IndexedDB through `src/lib/mastery.js`.
- The 3D classroom uses procedural geometry only, no CDN assets or large downloads.
- Online AI features degrade gracefully instead of breaking the app.

That means the demo can show the strongest story: **AI-enhanced when online, still useful when offline.**

## Tech Stack

| Layer | Technology |
| --- | --- |
| App | React 19, Vite 6, Tailwind CSS |
| PWA | vite-plugin-pwa, Workbox |
| Storage | IndexedDB via idb-keyval |
| 3D Simulation | Three.js |
| AI Tutor | Gemini / Vertex-compatible API through Vercel Functions |
| Speech-to-Text | Gemini audio STT, Web Speech fallback |
| Text-to-Speech | Google Cloud TTS, browser speechSynthesis fallback |
| Deployment Target | Vercel-compatible static app + serverless API routes |

## Project Map

```text
src/
  App.jsx                 screen routing, online state, mastery wiring
  content.json            bundled Grade 6 Number and Algebra content
  main.jsx                app bootstrap and service worker registration
  lib/
    check.js              answer checking
    mastery.js            IndexedDB mastery + spaced repetition
    speech.js             online/offline voice-out
    tutor.js              tutor fallback chain
    voicein.js            mic / recorder helpers
  screens/
    Home.jsx              hallway entry screen
    StartChoice.jsx       continue or browse lessons
    TopicPicker.jsx       competency picker
    LessonBrief.jsx       lesson overview + 2D/3D entry
    Classroom.jsx         2D Teacher Gabay classroom
    Classroom3D.jsx       React harness for Three.js classroom
    Games.jsx             Tindahan math game
    Progress.jsx          mastery overview
  three/
    scene.js              procedural 3D classroom
  ui/
    BottomNav.jsx         persistent navigation
    OnlineBadge.jsx       online/offline status indicator
    Primitives.jsx        cards, buttons, chips, mastery bar
    Mascot.jsx            Teacher Gabay mascot and speech bubble
api/
  tutor.js                online tutor endpoint
  transcribe.js           online speech-to-text endpoint
  tts.js                  online text-to-speech endpoint
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

Use `npm run preview` when testing PWA behavior, because the service worker only behaves like production after a build.

## Offline Test

1. Run `npm run build`.
2. Run `npm run preview`.
3. Open the preview URL once while online.
4. In DevTools, set Network to **Offline**.
5. Hard refresh the page.
6. Confirm the app still loads and the lesson flow still works.

Expected offline behavior:

- Home, lessons, topic picker, progress, games, and classrooms load.
- Bundled questions and explanations are available.
- Answer checking works.
- Mastery persists locally.
- Browser speech synthesis can still read lines aloud.
- Online-only mic/upload/API features are disabled or fall back safely.

## Environment Variables

Copy `.env.example` when configuring online AI services:

```bash
cp .env.example .env
```

Common variables used by the API routes:

```text
GCP_PROJECT=
GCP_LOCATION=
GCP_SA_KEY=
GEMINI_MODEL=
TTS_VOICE=
```

Do not commit real service account keys.

## Deploy Notes

The app is Vercel-friendly because the frontend builds to static assets and API routes live in `api/`.

Recommended Vercel CLI install:

```bash
npm i -g vercel
```

Useful commands after installing it:

```bash
vercel env pull
vercel deploy
vercel logs
```

## Judging Highlights

- **Impact**: designed for Filipino learners with unreliable connectivity.
- **Feasibility**: the core app runs with local content and local mastery state.
- **Innovation**: combines offline-first learning, AI fallback design, voice, 3D simulation, and game-based practice.
- **Demo reliability**: the app has a clear airplane-mode moment that proves the offline claim.
- **Scalability**: more competencies can be added to `src/content.json` without rewriting the learning engine.

## Current Status

Built:

- Offline PWA shell
- Grade 6 Number and Algebra content
- 2D classroom tutor
- 3D classroom simulation
- Tindahan game
- Progress and mastery tracking
- Online/offline status indicators
- Voice-out and voice-in fallback paths
- Vercel API route structure for online AI features

Needs final pre-submission pass:

- Replace Team GANGG member placeholders with final names.
- Add final demo screenshots or GIFs.
- Verify deployed environment variables.
- Run one full offline demo rehearsal.

## Visual Identity

<p align="center">
  <img src="public/pwa-192x192.png" alt="Gabay app icon" width="96" />
  <img src="public/maskable-512x512.png" alt="Gabay maskable icon" width="96" />
  <img src="public/favicon.svg" alt="Gabay favicon" width="72" />
</p>

- **Mascot:** Teacher Gabay, a friendly star guide for math practice.
- **Classroom feel:** pastel cards, bold outlines, and clear tap targets for mobile learners.
- **Demo sticker line:** Online AI when available. Offline learning when it matters.

## Credits

Built by **Team GANGG**.

Gabay means guide or mentor in Filipino. The project is built as a practical study companion for Filipino learners, with math examples grounded in familiar contexts like palengke, sari-sari stores, jeepney fares, discounts, and recipes.
