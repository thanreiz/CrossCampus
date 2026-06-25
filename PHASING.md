# Gabay â€” Phasing & Checklist

Status tracker for the 1-day build. Phase 1 (offline core) is built and review-ready.
Phase 2 (live AI) is **not started** â€” held for review per the build plan.

Legend: âœ… done Â· ðŸŸ¡ partial / stubbed Â· â¬œ not started

---

## Phase 1 â€” Offline Core (must work network-off)

### 1. PWA / offline
- âœ… `vite-plugin-pwa` (Workbox) integrated
- âœ… `registerType: 'autoUpdate'`
- âœ… precache `**/*.{js,css,html,json,png,svg}`
- âœ… `manifest.webmanifest` (name, theme, icons, standalone, portrait)
- âœ… SW registered in `main.jsx` (`registerSW({ immediate: true })`)
- âœ… build verified â€” SW generated, 9 precache entries (243 KiB)
- âœ… **manual offline reload test** â€” confirmed loading + working network-off
- âœ… PWA icons â€” 192/512 PNG + maskable generated (`npm run icons`), wired into manifest, precached

### 2. Content (`src/content.json`)
- âœ… imported, not fetched
- âœ… schema: `{ ref, domain, content_standard, competency, performance_standard, explanation{en,fil,taglish}, worked_example, items[{q,answer,type}] }`
- âœ… 6 G6 MATATAG Number & Algebra competencies seeded:
  - âœ… percent â†” fractions/decimals (`G6-NA-PERCENT-01`)
  - âœ… percentage / rate / base (`G6-NA-PERCENT-02`)
  - âœ… discount problems (`G6-NA-PERCENT-03`)
  - âœ… ratio & proportion (`G6-NA-RATIO-01`)
  - âœ… decimal operations (`G6-NA-DEC-01`)
  - âœ… GCF / LCM (`G6-NA-GCFLCM-01`)
- âœ… Filipino-context items (palengke, sari-sari, jeepney, recipe)
- â¬œ **verify exact MATATAG term placement** vs official SY2026-27 CG before demo

### 3. Screens
- âœ… Splash
- âœ… Home / hallway (3 doors: Mga Aralin, Klase ni Teacher Gabay, Aking Progreso)
- âœ… Start choice (Gabay-picks vs browse)
- âœ… Topic picker (grouped by domain + filter chips)
- âœ… Lesson brief (topic + ref/statement + "Ang gagawin mo" task list)
- âœ… Classroom scene (chalkboard tabs, mascot + speech bubble, desk answer field + Sumagot, auto-check)
- âœ… Progreso (per-competency mastery)

### 4. Adaptive mastery
- âœ… per-competency score 0â€“1 in IndexedDB (`idb-keyval`)
- âœ… correct +0.1, wrong âˆ’0.1
- âœ… wrong re-queues sooner (spaced repetition tick)
- âœ… "Ano'ng susunod?" surfaces lowest mastery
- âœ… persists offline + across reloads

### 5. Language toggle
- âœ… EN / Filipino / Taglish toggle on cached explanations (classroom chalkboard)

### 6. Voice-OUT
- âœ… `speechSynthesis`, on-device, offline
- âœ… prefers fil / tl / en-PH voice
- âœ… handles async `onvoiceschanged`
- âœ… auto-reads Gabay lines + "ðŸ”Š Pakinggan ulit" replay
- âœ… cancels in-progress utterance (StrictMode-safe)

---

## Simulation status (read carefully)

Two different "simulations" â€” don't confuse them:

### A. Classroom roleplay simulation (build plan Â§â­) â€” âœ… DONE (Claude, Phase 1)
- âœ… hallway â†’ topic â†’ lesson brief â†’ classroom scene flow
- âœ… chalkboard (explanation / worked example / practice tabs)
- âœ… star mascot + speech bubble (read aloud)
- âœ… student "at desk" answer field + Sumagot + auto-check
- âœ… decorative gated mic / "ðŸ™‹ Itaas ang kamay" buttons (offline-disabled)
- This is the "stage reskin over the existing engine" the plan describes â€” built in `src/screens/Classroom.jsx`.

### B. 3D classroom simulation (codex's task) - BUILT IN THIS REPO
Source of truth: embedded React + Three.js implementation, using the existing `Classroom3D.jsx` harness.

What it is:
- done web-based 3D classroom simulation (player = teacher/student POV): WASD move, mouse/touch look,
  walk to blackboard, answer MATATAG math questions
- done offline-first: uses bundled `three`, procedural geometry only, no CDN/assets/physics engine
- done Grade 6 Number & Algebra only, reusing this repo's `content.json`, `check.js`, `mastery.js`, and `speech.js`
- done lesson brief includes a 3D entry button; 2D classroom still works unchanged

Implementation:
- done `src/screens/Classroom3D.jsx` React harness owns HUD/modal/answer/mastery/voice bridge
- done `src/three/scene.js` owns the Three.js classroom, controls, blackboard CanvasTexture, proximity,
  feedback flash, collision, resize, animation loop, and cleanup/disposal
- done `src/App.jsx` has a `classroom3d` screen case with the same props as the 2D classroom
- done `src/screens/LessonBrief.jsx` exposes `Pumasok sa 3D Klase (beta)`

Verification:
- done `npm run build` succeeds
- done PWA precache includes `assets/Classroom3D-*.js` (Three.js bundled in the lazy 3D chunk)
- partial browser automation: local Chrome can load the app via headless DOM dump, but the in-app browser
  plugin is unavailable and Chrome remote-debugging exits immediately in this environment, so manual browser
  click-through is still needed for final visual/canvas verification

Manual browser test remaining:
- open the app, pick a lesson, tap `Pumasok sa 3D Klase (beta)`
- walk to the board, verify `Sagutin` appears, answer a question, confirm mastery/voice feedback
- enter/exit 3D repeatedly and check the console for WebGL/context errors
### Constraints
- âœ… mobile-first 360px
- âœ… no accounts
- âœ… no localStorage / sessionStorage (IndexedDB only)
- âœ… no API keys in client code

### Art direction
- âœ… cream bg, pastel palette tokens
- âœ… 2.5px outlines, hard 4px offset shadow, pill buttons/chips, 24px corners
- âœ… Baloo 2 (display) / Nunito (body) with system fallback
- âœ… star-in-gradcap mascot + speech bubble
- âœ… light doodles (sparkles, clouds, plants)

---

## Phase 2 — Live AI — ✅ BUILT (Claude)

### 7. Teacher Gabay tutor — `askTeacherGabay(question, ref)` — ✅ `src/lib/tutor.js`
- ✅ fallback chain (a) on-device Gemini Nano if `'LanguageModel' in self` && `availability()==='available'`
- ✅ (b) else online → `POST /api/tutor` (Vertex/Gemini proxy)
- ✅ (c) else cached Taglish explanation (the floor)
- ✅ cache replies in IndexedDB `tutor:{ref}:{hash}` (with source label)
- ✅ trilingual via system prompt (inject competency, no lang detection)
- ✅ wired into 2D Classroom "🙋 Itaas ang kamay" ask panel (source chip + replay + voice-out)

### 8. Voice-IN — ✅ `src/lib/voicein.js`
- ✅ `SpeechRecognition` / `webkitSpeechRecognition` wrapper, `lang='fil-PH'` placeholder
- ✅ mic enabled only when `navigator.onLine` (App passes `online`; toggles on online/offline events)
- ✅ recognized text auto-asks Gabay; recognizer stopped on unmount
- ⬜ pre-test Taglish recognition accuracy on real device before demo (known shaky)

### 9. Serverless tutor stub — ✅ `api/tutor.js`
- ✅ `/api/tutor` Vercel Function, kept separate from client
- ✅ returns curriculum-grounded placeholder so the full chain is testable end-to-end
- ⬜ actual Vertex/Gemini call left as clearly-marked TODO (creds via Vercel env var, never client)
- ⬜ deploy to Vercel + set service-account env var

---

## Build-time / pre-demo (from plan Â§8, not app code)
- â¬œ Featherless content generation pipeline (`scripts/generate-content.js`) â€” *currently seeded by hand; optional*
- â¬œ Nano pre-demo prep (Chrome 148+, flags, `chrome://components` download, airplane-mode verify)
- â¬œ rehearse 3-min demo script twice incl. airplane mode

---

## Cut order if behind (plan Â§11 hard rule)
1. drop mic (voice-in)
2. drop Nano (online-only tutor)
3. drop whole live tutor â€” board + cached explanation still teach

Offline core + MATATAG grounding = the win. Everything below it is bonus.

