# Gabay — Grade 6 Math Study Companion 🌟

**Offline-first, mobile-first PWA** that tutors **Grade 6** Filipino learners in
**English / Filipino / Taglish**, with every lesson mapped to a real **DepEd MATATAG**
Number & Algebra competency. Built for the ACM TechSprint: Asteria — Accenture track
("AI-Powered Study Companion for Filipino Learners").

> The core tutoring loop — lessons, worked examples, practice, auto-checking, mastery,
> and Teacher Gabay reading aloud — **works fully with the network off.**

---

## ✅ Phase 1 — what's built (offline core)

- **Offline-first PWA** — `vite-plugin-pwa` (Workbox), `registerType: 'autoUpdate'`,
  precaches `**/*.{js,css,html,json,png,svg}`. Installable; loads with no signal.
- **Bundled content** — 6 Grade 6 MATATAG Number & Algebra competencies in
  `src/content.json` (imported, not fetched): percent ↔ fractions/decimals;
  percentage/rate/base; discount problems; ratio & proportion; decimal operations;
  GCF/LCM. Filipino-context word problems (palengke, sari-sari, jeepney, recipes).
- **Screens:** Splash → Home/hallway (3 doors: *Mga Aralin*, *Klase ni Teacher Gabay*,
  *Aking Progreso*) → Start choice → Topic picker (grouped by domain + filter chips) →
  Lesson brief (competency ref/statement + "Ang gagawin mo") → **Classroom scene**
  (chalkboard with explanation/worked-example/practice tabs, star mascot + speech
  bubble, desk bar with answer field + *Sumagot*, auto-check).
- **Adaptive mastery** — per-competency score 0–1 in **IndexedDB** (`idb-keyval`):
  correct +0.1, wrong −0.1 and re-queued sooner (spaced repetition). "Ano'ng susunod?"
  surfaces the lowest-mastery competency. Persists offline + across reloads.
- **EN / Filipino / Taglish toggle** on every cached explanation.
- **Voice-OUT** — Teacher Gabay reads replies aloud via on-device `speechSynthesis`
  (prefers a `fil`/`tl`/`en-PH` voice, handles async `onvoiceschanged`). Works offline.
- **Art direction** — cute doodle / soft neo-brutalism: cream bg, pastel cards, 2.5px
  black outlines, hard offset shadows, pill buttons, 24px corners, Baloo 2 / Nunito.

### Constraints honored
Mobile-first (360px), no accounts, no `localStorage`/`sessionStorage` (state lives in
IndexedDB), no API keys in client code.

---

## 🚀 Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build + preview (needed to exercise the service worker):

```bash
npm run build
npm run preview    # serves dist/ with the SW active
```

### Test the offline core (the demo moment)
1. `npm run build && npm run preview`, open the URL.
2. Load once online (lets the SW precache the shell + content).
3. Open DevTools → **Network → Offline** (or turn on airplane mode), then **hard-reload**.
4. App still loads; lessons, practice, mastery, and voice-out keep working.
   - If you get a network error, a file slipped past `globPatterns` in `vite.config.js`.

---

## 🗺️ Project map

```
src/
  content.json          # 6 MATATAG competencies (schema below) — bundled, offline
  App.jsx               # screen state machine + online/mastery wiring
  lib/
    mastery.js          # IndexedDB mastery + spaced repetition + pickNext
    speech.js           # speechSynthesis voice-out (fil voice, async load)
    check.js            # tolerant numeric/mcq auto-checking
  ui/
    Primitives.jsx      # Button / Card / Chip / RefBadge / MasteryBar / Doodles
    Mascot.jsx          # Teacher Gabay star + speech bubble
  screens/
    Splash · Home · StartChoice · TopicPicker · LessonBrief · Classroom · Progress
public/
  mascot.svg · favicon.svg
vite.config.js          # VitePWA (Workbox) config
```

### Content schema (per competency)
```json
{
  "ref": "G6-NA-PERCENT-03",
  "domain": "Number and Algebra",
  "content_standard": "...",
  "competency": "Solve real-life problems involving percent (discount, sale price).",
  "performance_standard": "...",
  "explanation": { "en": "...", "fil": "...", "taglish": "..." },
  "worked_example": "Palengke: ₱250 na item, 20% off. Magkano ang babayaran?",
  "items": [ { "q": "₱250 less 20% = ?", "answer": "200", "type": "numeric" } ]
}
```

---

## ⏭️ Phase 2 (NOT built yet — awaiting review)

Per the build plan, stopped here for review. Phase 2 adds:
- `askTeacherGabay(question, ref)` fallback chain: on-device **Gemini Nano** →
  online **`/api/tutor`** proxy (Vertex/Gemini) → cached Taglish explanation, with
  replies cached in IndexedDB (`tutor:{ref}:{hash}`).
- **Voice-IN** — mic enabled only when `navigator.onLine`; `SpeechRecognition`
  `lang='fil-PH'`. (The classroom already shows the gated mic / "🙋 Itaas ang kamay"
  buttons — currently disabled offline, ready to wire.)
- A separate `/api/tutor` serverless stub holding Vertex creds (TODO marker).

---

*Gabay (Filipino: "guide / mentor"). Curriculum source: official DepEd MATATAG
Mathematics Curriculum Guide — confirm exact term placement before the demo.*
