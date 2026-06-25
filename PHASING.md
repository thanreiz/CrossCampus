# Gabay — Phasing & Checklist

Status tracker for the 1-day build. Phase 1 (offline core) is built and review-ready.
Phase 2 (live AI) is **not started** — held for review per the build plan.

Legend: ✅ done · 🟡 partial / stubbed · ⬜ not started

---

## Phase 1 — Offline Core (must work network-off)

### 1. PWA / offline
- ✅ `vite-plugin-pwa` (Workbox) integrated
- ✅ `registerType: 'autoUpdate'`
- ✅ precache `**/*.{js,css,html,json,png,svg}`
- ✅ `manifest.webmanifest` (name, theme, icons, standalone, portrait)
- ✅ SW registered in `main.jsx` (`registerSW({ immediate: true })`)
- ✅ build verified — SW generated, 9 precache entries (243 KiB)
- ✅ **manual offline reload test** — confirmed loading + working network-off
- ✅ PWA icons — 192/512 PNG + maskable generated (`npm run icons`), wired into manifest, precached

### 2. Content (`src/content.json`)
- ✅ imported, not fetched
- ✅ schema: `{ ref, domain, content_standard, competency, performance_standard, explanation{en,fil,taglish}, worked_example, items[{q,answer,type}] }`
- ✅ 6 G6 MATATAG Number & Algebra competencies seeded:
  - ✅ percent ↔ fractions/decimals (`G6-NA-PERCENT-01`)
  - ✅ percentage / rate / base (`G6-NA-PERCENT-02`)
  - ✅ discount problems (`G6-NA-PERCENT-03`)
  - ✅ ratio & proportion (`G6-NA-RATIO-01`)
  - ✅ decimal operations (`G6-NA-DEC-01`)
  - ✅ GCF / LCM (`G6-NA-GCFLCM-01`)
- ✅ Filipino-context items (palengke, sari-sari, jeepney, recipe)
- ⬜ **verify exact MATATAG term placement** vs official SY2026-27 CG before demo

### 3. Screens
- ✅ Splash
- ✅ Home / hallway (3 doors: Mga Aralin, Klase ni Teacher Gabay, Aking Progreso)
- ✅ Start choice (Gabay-picks vs browse)
- ✅ Topic picker (grouped by domain + filter chips)
- ✅ Lesson brief (topic + ref/statement + "Ang gagawin mo" task list)
- ✅ Classroom scene (chalkboard tabs, mascot + speech bubble, desk answer field + Sumagot, auto-check)
- ✅ Progreso (per-competency mastery)

### 4. Adaptive mastery
- ✅ per-competency score 0–1 in IndexedDB (`idb-keyval`)
- ✅ correct +0.1, wrong −0.1
- ✅ wrong re-queues sooner (spaced repetition tick)
- ✅ "Ano'ng susunod?" surfaces lowest mastery
- ✅ persists offline + across reloads

### 5. Language toggle
- ✅ EN / Filipino / Taglish toggle on cached explanations (classroom chalkboard)

### 6. Voice-OUT
- ✅ `speechSynthesis`, on-device, offline
- ✅ prefers fil / tl / en-PH voice
- ✅ handles async `onvoiceschanged`
- ✅ auto-reads Gabay lines + "🔊 Pakinggan ulit" replay
- ✅ cancels in-progress utterance (StrictMode-safe)

---

## Simulation status (read carefully)

Two different "simulations" — don't confuse them:

### A. Classroom roleplay simulation (build plan §⭐) — ✅ DONE (Claude, Phase 1)
- ✅ hallway → topic → lesson brief → classroom scene flow
- ✅ chalkboard (explanation / worked example / practice tabs)
- ✅ star mascot + speech bubble (read aloud)
- ✅ student "at desk" answer field + Sumagot + auto-check
- ✅ decorative gated mic / "🙋 Itaas ang kamay" buttons (offline-disabled)
- This is the "stage reskin over the existing engine" the plan describes — built in `src/screens/Classroom.jsx`.

### B. "Tindahan Game" simulation (codex's task) — 🟡 DESIGNED IN STITCH, NOT IN CODE
- 🟡 **identified**: it's the **"Tindahan Game"** (palengke/sari-sari store math game)
- 🟡 exists as a **Stitch design only** — screen `Gabay - Tindahan Game Main`
  (`projects/12374821809926735074/screens/e8c13f2de02e4b5f972e4f5bfc792600`)
- ⬜ **no React code in `src/`** yet — not built, not in repo
- ⬜ owned by **codex** (only `scripts/codex-usage.mjs` + `codex-usage.html` landed here = token-usage report, unrelated)
- ⬜ mount point undefined: likely a 4th Home door or a mode inside Classroom
- ⬜ must read mastery from IndexedDB + stay offline-safe (no live AI) to fit Phase 1 core
- ⬜ wire numeric auto-check to existing `lib/check.js`; award mastery via `lib/mastery.js`
- **Action:** when codex pushes the Tindahan Game code/branch, paste it so it can be wired + tracked here

> Related Stitch screens for this project (design reference, mobile):
> Splash · Home Hallway · Start Choice · Topic Picker · Lesson View · Classroom Scene ·
> Teacher Gabay Chat · **Tindahan Game Main** · Logo & Mascot

### Constraints
- ✅ mobile-first 360px
- ✅ no accounts
- ✅ no localStorage / sessionStorage (IndexedDB only)
- ✅ no API keys in client code

### Art direction
- ✅ cream bg, pastel palette tokens
- ✅ 2.5px outlines, hard 4px offset shadow, pill buttons/chips, 24px corners
- ✅ Baloo 2 (display) / Nunito (body) with system fallback
- ✅ star-in-gradcap mascot + speech bubble
- ✅ light doodles (sparkles, clouds, plants)

---

## Phase 2 — Live AI (after Phase 1 approval) — ⬜ NOT STARTED

### 7. Teacher Gabay tutor — `askTeacherGabay(question, ref)`
- ⬜ fallback chain (a) on-device Gemini Nano if `'LanguageModel' in self` && `availability()==='available'`
- ⬜ (b) else online → `POST /api/tutor` (Vertex/Gemini proxy placeholder)
- ⬜ (c) else cached Taglish explanation
- ⬜ cache replies in IndexedDB `tutor:{ref}:{hash}`
- ⬜ trilingual via system prompt (inject competency, no lang detection)

### 8. Voice-IN
- 🟡 mic + "🙋 Itaas ang kamay" buttons rendered in classroom, **disabled offline** (gating UI done)
- ⬜ wire `SpeechRecognition` `lang='fil-PH'`
- ⬜ toggle on `online`/`offline` events (App already tracks `online` state — ready to pass through)

### 9. Serverless tutor stub
- ⬜ `/api/tutor` function (Vercel/Cloud Run) holding Vertex creds
- ⬜ kept separate from client
- ⬜ actual Vertex call left as marked TODO

---

## Build-time / pre-demo (from plan §8, not app code)
- ⬜ Featherless content generation pipeline (`scripts/generate-content.js`) — *currently seeded by hand; optional*
- ⬜ Nano pre-demo prep (Chrome 148+, flags, `chrome://components` download, airplane-mode verify)
- ⬜ rehearse 3-min demo script twice incl. airplane mode

---

## Cut order if behind (plan §11 hard rule)
1. drop mic (voice-in)
2. drop Nano (online-only tutor)
3. drop whole live tutor — board + cached explanation still teach

Offline core + MATATAG grounding = the win. Everything below it is bonus.
