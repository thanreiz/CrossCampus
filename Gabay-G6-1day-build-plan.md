# Gabay — 1-Day Hackathon Build Plan (Grade 6)
### ACM TechSprint: Asteria — Accenture Track: AI-Powered Study Companion for Filipino Learners

> *Gabay* (Filipino: "guide / mentor"). Working name — swap freely.

---

## 0. The challenge (official brief)

**Accenture Project Case: AI-Powered Study Companion for Filipino Learners**

Many Filipino students face barriers to quality educational support due to limited access to tutors, connectivity constraints, and language differences. Existing learning platforms often fail to accommodate diverse learning needs, particularly for students who prefer learning in Filipino or require personalized guidance aligned with their grade level.

The challenge: develop an AI-powered study companion that provides accessible and personalized academic assistance for Filipino learners. The solution should be capable of explaining concepts in both Filipino and English, generating practice exercises, and adapting to a student's learning level. Teams are encouraged to design solutions optimized for mobile devices and low-bandwidth environments so quality educational support is accessible regardless of location or circumstance.

**How Gabay maps to every line of the brief:**
- *Limited access to tutors* → an always-available study companion.
- *Connectivity constraints / low-bandwidth* → offline-first PWA (the core win).
- *Language differences / prefers Filipino* → EN / Filipino / **Taglish** explanation toggle.
- *Personalized, grade-level-aligned guidance* → MATATAG Grade 6 grounding + adaptive mastery engine.
- *Generating practice exercises* → per-competency auto-checkable item bank.
- *Mobile-optimized* → mobile-first PWA, works at 360px.

---

## 1. The one-line pitch

An **offline-first study companion** that tutors **Grade 6** Filipino learners in **Taglish**, with every explanation and exercise mapped to a real **DepEd MATATAG** learning competency — so it works with zero signal and proves it's curriculum-grounded, not a generic chatbot.

**Why Grade 6:** it's the last grade DepEd's own exit exam (NAT) measures before junior high, and it just entered the MATATAG rollout this school year (SY 2026-2027) — the freshest curriculum. We intervene at the exact grade the system scores, in the exact year, before the gap hardens.

---

## 2. Why this wins (the strategy)

In a 1-day hackathon, **everyone ships a GPT-wrapper tutor.** Completion risk is low; *differentiation* risk is high. So we win on the two things nobody else will bother to do:

1. **Offline-first that actually works** — the core tutoring loop runs with the network off. This is the demo moment (airplane mode mid-pitch) and what makes Accenture judges believe it's deployable in real Philippine conditions.
2. **Real DepEd MATATAG grounding** — every concept and item references a named learning competency from the official Grade 6 Math Curriculum Guide. This is the "not a generic wrapper" proof.

Everything else is cut.

---

## 3. Why Grade 6 — the data (drop this in your deck)

Filipino math proficiency is low at every grade that's actually measured, and Grade 6 is the strategic intervention point.

- **NAT (DepEd's own exit exam, 2024):** national math Mean Percentage Score sits in the **mid-30s out of 100 — "Low Proficiency."** Grade 12 math: 35.34 (Academic), 30.97 (TVL), 27.89 (Sports). Grade 10 divisional study: 37.74, "low proficient." Math is consistently the worst subject.
- **TIMSS 2019 (Grade 4):** Philippines scored 297 — **lowest of all 58 participating countries**; only 19% reached the Low benchmark, so **81% couldn't clear basic arithmetic**.
- **PISA 2022 (15-year-olds):** **84% below baseline (Level 2)** in math; among the lowest of 80 countries.

**The argument:** NAT measures at Grades 6, 10, 12 — Grade 6 is the *last checkpoint before junior high*. Students leave elementary already at Low Proficiency, then the same gap shows up in the Grade 10 and Grade 12 NAT and at 15 in PISA. Target-grade = measured-grade is the tightest possible impact logic: Gabay intervenes in the exact grade DepEd scores, so it can plausibly move the number they track.

**Pitch line:**
> "DepEd's own NAT scores Grade 6 math at 'Low Proficiency' — mid-30s out of 100. Gabay targets that exact grade, in that exact year, before students carry the gap into junior high."

> Honest framing: the NAT *reveals* the gap; it doesn't *create* it (the cliff starts forming at Grade 4). Position Grade 6 as the last elementary checkpoint, not a magic fix.

---

## 4. Scope — ruthless

### IN (build these)
- One grade band, one subject: **Grade 6 Mathematics**, Number & Algebra strand (numeric items are auto-checkable — perfect for a demo).
- Offline-first PWA: installable, service worker, pre-cached content.
- MATATAG competency tree (5–8 competencies is plenty).
- Pre-generated item bank per competency (auto-gradable).
- Lightweight adaptive engine: per-competency mastery + simple spaced repetition.
- **Teacher Gabay** — trilingual AI tutor (EN/Tagalog/Taglish), launched from a button; online via Vertex/Gemini, offline via Nano, cached fallback. Separate online layer; never blocks the offline core.
- **Voice** — AI talks via on-device `speechSynthesis` (works offline); student can talk back via mic only when online.
- Taglish / Filipino / English explanation toggle (the static cached explanations).

### OUT (cut — none of it wins points in 1 day)
- Multiple subjects / grade levels
- Accounts, auth, user profiles
- Dashboards / analytics / teacher view
- Voice, SMS/USSD fallback
- Voice, SMS/USSD fallback (voice-in is online-only; see Voice section)
- Making the lesson core depend on a live AI call (this is the trap — see §7)

---

## 5. Content slice — Grade 6 Number & Algebra (Taglish-money gold)

Use the **percent + ratio/proportion + decimal-operations** strand. It's auto-checkable *and* maps straight to palengke discounts, sari-sari budgeting, and recipe ratios. These are real Grade 6 MATATAG competencies (Number and Algebra domain):

- describe and apply the concepts of **ratio and proportion** (illustrate using tables / double number line)
- relate **percent** to fractions and decimals
- identify the **percentage, rate, and base** in a problem
- solve real-life **percent** problems (discount, sale price)
- perform the **four operations on decimals**
- find **GCF and LCM**; apply GEMDAS / order of operations

> Source: official MATATAG Mathematics Curriculum Guide + DepEd Grade 6 Lesson Exemplars (openly licensed under EO No. 2, s. 2016 — free to adapt with attribution). **Confirm the exact term placement** of each in the Grade 6 CG before the demo; the SY 2026-2027 trimester reorg regroups quarters into terms, but the competencies themselves are unchanged.

---

## 6. Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind | Your stack, fast scaffold |
| PWA / offline | `vite-plugin-pwa` (Workbox) | Service worker + precache in ~20 min |
| State | React state + IndexedDB (`idb-keyval`) | Mastery state survives offline |
| Content | Static JSON (competency tree + item bank), bundled & cached | No backend needed for core loop |
| Build-time AI | **Featherless** (flat-rate) | Mass-generate cached EN/Fil/Taglish content — runs once, before demo |
| Live tutor AI | **Vertex AI / Gemini** (via proxy) | Strong trilingual "Teacher Gabay" when online ($300 credit) |
| Offline tutor AI | **Gemini Nano** (on-device) | True offline answers on capable laptops — light tasks only |

No backend required for the offline core. The live tutor needs a tiny serverless proxy to hold the Vertex credentials (never put service-account keys in client-side PWA code).

---

## 7. The one trap to avoid

Do **not** make the core lessons depend on a live AI call. Pre-generate the item bank and the EN/Fil/Taglish explanations and cache them, so lessons + practice + mastery work with zero signal. The live "Teacher Gabay" tutor is a **separate online layer** that degrades gracefully (cloud → on-device Nano → cached text) — it enhances the app when there's signal but never blocks the offline core. If the wifi dies during your demo, lessons keep working and Nano/cached covers the tutor. Bulletproof the offline path first.

---

## 8. The AI architecture — three providers, three jobs

Each provider sits on a different axis. Two are *runtime* tutor brains (one online, one offline); one is a *build-time* generator the app never calls.

| Provider | Runs | When | Job |
|---|---|---|---|
| **Featherless** | online, **build-time** (your machine) | before the demo | mass-generate the cached EN/Fil/Taglish lessons + items |
| **Vertex / Gemini** | online, **runtime** | signal present | strong live "Teacher Gabay" tutor; every reply cached |
| **Gemini Nano** | **on-device, runtime** | **no signal**, capable laptop | true offline tutor — rephrasing / "explain simpler" only |

Key mental model: **Featherless never runs offline.** It runs *before* offline — its frozen output is what gets cached and served with no signal. The student's app only ever calls Vertex (online) or Nano (offline).

### Tier 0 — Featherless: the build-time content pipeline

Run ONCE, online, on your dev machine. Writes all cached content into `content.json`; after that it's never touched again.
```js
// scripts/generate-content.js  — Featherless, run once before the demo
const competencies = loadMatatagCompetencies(); // G6 Math NA, from official CG
for (const c of competencies) {
  c.explanation = {
    en:      await featherless(`Explain ${c.goal} for a Grade 6 student.`),
    fil:     await featherless(`Ipaliwanag ${c.goal} para sa Grade 6.`),
    taglish: await featherless(`Explain ${c.goal} in casual Taglish.`),
  };
  c.items = await featherless(`5 auto-checkable practice items for ${c.goal}, with answers, JSON.`);
}
fs.writeFileSync('src/content.json', JSON.stringify(competencies));
```
> Test Featherless Taglish quality first. If a model there explains awkwardly in Taglish, generate with Gemini instead and drop Featherless — no loss to the app.

**The cached output is served offline** via the service worker + IndexedDB (unchanged):

| What | Where | Why |
|---|---|---|
| App shell (JS/CSS/HTML/icons) | Cache Storage (service worker) | app *loads* with no network |
| `content.json` | bundled into JS → precached | static, never changes |
| Mastery, answered items, tutor cache | IndexedDB | mutable, must persist |

```js
// vite.config.js
VitePWA({ registerType: 'autoUpdate', workbox: { globPatterns: ['**/*.{js,css,html,json,png,svg}'] } });
```
```js
import content from './content.json';   // always available offline
import { get, set } from 'idb-keyval';
const mastery = (await get('mastery')) ?? {};
function answer(ref, correct) {
  mastery[ref] = (mastery[ref] ?? 0.5) + (correct ? 0.1 : -0.1);
  set('mastery', mastery);
}
```

### Tier 1 — Vertex/Gemini: the live "Teacher Gabay" tutor (online)

The strong brain. When there's signal, the student asks Teacher Gabay anything in English, Tagalog, or Taglish, and it teaches the Grade 6 competency back in the same register. Every reply is cached for offline re-reading.

### Tier 2 — Gemini Nano: the offline tutor (on-device, capable laptops)

Real inference with no signal — but weak at multi-step math. Use it for rephrasing ("ipaliwanag mo ulit, mas simple"), not hard problems. Requires **Chrome 148+**, ~16 GB RAM, ~22 GB free disk, one-time 2.7–4 GB download. No mobile/iOS — a demo-machine flourish, not the backbone.

### The fallback chain (best-available first)

```js
async function askTeacherGabay(question, ref) {
  const cacheKey = `tutor:${ref}:${hash(question)}`;
  const cached = await get(cacheKey);
  if (cached) return cached;

  const sysPrompt = gabayPrompt(content.find(c => c.ref === ref).competency);

  // 1. On-device Nano — works OFFLINE on capable laptops (light tasks)
  if ('LanguageModel' in self && (await LanguageModel.availability()) === 'available') {
    const s = await LanguageModel.create({ initialPrompts: [{ role: 'system', content: sysPrompt }] });
    const text = await s.prompt(question);
    await set(cacheKey, text);
    return text;
  }
  // 2. Online — Vertex/Gemini, the strong tutor (via proxy)
  if (navigator.onLine) {
    const text = (await fetch('/api/tutor', {
      method: 'POST', body: JSON.stringify({ question, ref })
    }).then(r => r.json())).text;
    await set(cacheKey, text);   // cache for offline re-read
    return text;
  }
  // 3. Fully offline, no Nano — the pre-generated cached explanation
  return content.find(c => c.ref === ref).explanation.taglish;
}
```
> Tradeoff to respect: order by *strength*, not just availability. Gemini (online) is the real teacher; Nano (offline) is the impressive-but-limited backup; cached text is the floor. In the demo, give Nano a *rephrase*, never a hard multi-step problem.

**The trilingual part is a prompt, not a feature you build.** Gemini and Nano natively understand and produce English, Tagalog, and Taglish — no language detection or translation layer:
```
You are Teacher Gabay, a friendly Grade 6 math tutor. The student may write in
English, Tagalog, or a Taglish mix — reply in the same style, unless they picked a
language. Teach using this DepEd MATATAG competency: [competency]. Use Filipino
real-life examples (palengke, jeepney fare, sari-sari store). Never just give the
final answer — guide them step by step.
```

**Vertex proxy (≈20 min):** stand up a Vercel/Cloud Run function holding the service-account key; the PWA calls `/api/tutor`, the proxy calls Vertex. Never ship credentials in client code.

**Nano pre-demo prep (night before, on wifi):** update Chrome to 148+ → enable `chrome://flags/#prompt-api-for-gemini-nano` and `#optimization-guide-on-device-model` ("Enabled BypassPerfRequirement") → trigger download via `chrome://components` (~10 min) → verify `await LanguageModel.availability()` is `"available"` → test in airplane mode. Keep ~10 GB free after download or Chrome evicts the model.

**Offline test:** load online once → go offline → hard-reload. Loads fully = precache correct. Network error = your `globPatterns` missed a file.

---

## 9. MATATAG grounding — the content schema

MATATAG uses **Content Domain → Content Standard → Learning Competency → Performance Standard**, by quarter/term. No legacy alphanumeric codes. Your badge references domain + the actual competency statement, e.g. `G6 · NA · Percent`.

```json
{
  "ref": "G6-NA-PERCENT-01",
  "domain": "Number and Algebra",
  "content_standard": "Percentages, and their relationships with fractions and decimals.",
  "competency": "Solve real-life problems involving percent (e.g., discount, sale price).",
  "performance_standard": "Relate and apply percentages in real-life contexts.",
  "explanation": { "en": "...", "fil": "...", "taglish": "..." },
  "worked_example": "Palengke: ₱250 na item, 20% off. Magkano ang babayaran?",
  "items": [ { "q": "₱250 less 20% = ?", "answer": "200", "type": "numeric" } ]
}
```
Show `G6 · NA · Percent` + the competency statement on every lesson. When a judge asks "is this aligned to curriculum?", point at the live MATATAG competency.

---

## 10. Adaptive engine (keep it simple)

- Each competency has a mastery score `0.0–1.0`, stored in IndexedDB.
- Correct answer → mastery up; wrong → down + competency re-queued sooner (spaced repetition).
- "What's next?" surfaces the lowest-mastery, due competency.
- No ML needed — a transparent rule-based mastery model is *more* defensible to judges than a black box, and ships in an hour.

---

## ⭐ Teacher Gabay — the classroom simulation

The companion's soul, framed as a **roleplay classroom** (the way medkit frames you as a doctor seeing patients): the student enters Teacher Gabay's virtual class, Gabay teaches at the board, and the student answers and asks — in English, Tagalog, or Taglish.

**The flow mirrors a clinic sim** (hallway → pick patient → doorway brief → consult room):
hallway → **pick a topic** → **lesson brief** → **classroom scene.**
- **Lesson brief** (like medkit's "doorway brief"): topic title, the MATATAG competency ref + statement, and "Ang gagawin mo" (your task) — e.g. *1. Intindihin ang percent. 2. Sagutin ang 3 tanong sa board. 3. Magtanong kung hindi malinaw.*
- **Classroom scene:** a chalkboard at the front with the current problem/worked example; Teacher Gabay (the star-mascot guide) beside it with a speech bubble that's also read aloud; the student "at their desk" with an answer field, a "🙋 Itaas ang kamay" (ask) button, and a mic (online only).

**Scope-saving truth:** the classroom is a *stage*, not a new engine. The board = your existing explanation/worked-example renderer; Gabay's speech bubble = the tutor output (§8); the "Sumagot" field = your existing practice items + mastery. You're reskinning what's already built — that's what makes a roleplay scene survivable in one day. A couple of decorative classmate avatars at desks sell the "class" feel for free; keep them static.

**How it runs** (full detail in §8): online it's **Vertex/Gemini** (strong brain); offline on a capable laptop it's **Gemini Nano** (light rephrasing); fully offline with no Nano it serves the **cached** competency explanation. Every reply is cached for offline re-reading.

**Why it's honest about offline:** lessons, the board, practice, and mastery are fully offline; only the *live* back-and-forth (talking to Gabay, mic) needs signal. Hits both halves of the brief — "explain in Filipino and English" *and* "low-bandwidth" — without faking offline AI.

**Build notes:**
- Trilingual behavior is the system prompt in §8 — no language-detection code.
- Inject the active competency text so Gabay stays on-curriculum.
- Online path goes through the Vertex proxy; never ship keys client-side.
- Cut order if behind: drop the mic → drop Nano → drop the live tutor (the board + cached explanation still teach). The classroom stage itself is cheap; the live AI is the cuttable part.

---

## ⭐ Voice — Teacher Gabay talks (and listens when online)

The rule, which doubles as a feature the student can feel: **offline, the AI talks; online, the student can talk back too.**

| Mode | Voice OUT (AI talks) | Voice IN (student talks) |
|---|---|---|
| **Offline** | ✅ `speechSynthesis` — on-device, free, no signal | ❌ disabled (mic button hidden/greyed) |
| **Online** | ✅ same | ✅ enabled — student speaks their question |

### Voice OUT — always on, even offline (the safe, strong half)

The browser's built-in `speechSynthesis` runs on-device, costs nothing, and works with no signal. Teacher Gabay reads every reply aloud — pick a Filipino voice if the device has one.
```js
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  const fil = speechSynthesis.getVoices().find(v => v.lang.startsWith('fil') || v.lang.startsWith('tl'));
  if (fil) u.voice = fil;            // else default voice still works
  u.rate = 0.95;
  speechSynthesis.speak(u);
}
```
Hearing Gabay explain a palengke problem out loud in Taglish is a genuinely strong demo moment, and it survives airplane mode.

### Voice IN — online only (the gated bonus)

Toggle the mic button on `navigator.onLine`. Two implementation options, pick by time/teammate:

- **Quick:** browser `SpeechRecognition` with `lang='fil-PH'`. Online-only, English-first — Taglish recognition is shaky, so **pre-test hard** and keep it off the critical path.
- **Better Taglish (if a teammate can take it):** record the audio clip, send it to **Vertex/Gemini** through the `/api/tutor` proxy — it handles Filipino audio far better than the browser recognizer. Still online, much stronger.

```js
const micEnabled = navigator.onLine;   // gate the button on connectivity
window.addEventListener('online',  () => setMic(true));
window.addEventListener('offline', () => setMic(false));
```

> **Why not voice-in offline:** good Filipino/Taglish *speech recognition* has no easy offline API — that's literally the other hackathon track's hard problem (Tinig sa Liwanag). Don't drag it into a 1-day build. Gating voice-in to online sidesteps it cleanly and turns the constraint into a sensible UX rule.

**Scope:** voice-OUT is low-risk, build it with the tutor. Voice-IN is a bonus — cut it before the tutor itself if behind.

---

## 11. Hour-by-hour timeline (~11 hrs)

| Time | Checkpoint | Done = |
|---|---|---|
| **H0–1** | Scaffold + content skeleton | Vite PWA app runs; `content.json` schema defined. (Featherless content generated the night before, on wifi.) |
| **H1–3** | MATATAG content | 5–8 G6 Math NA competencies copied from the CG, each with domain/competency ref, plain-language goal, 1 worked example, 4–6 practice items (with answers) |
| **H3–5** | Core tutoring loop | Pick competency → see explanation → answer items → auto-check → mastery updates. Works fully offline. |
| **H5–6** | Offline hardening | Service worker precaches everything; mastery persists in IndexedDB; test with network OFF |
| **H6–7** | Taglish layer | Each explanation has EN / Tagalog / Taglish variants (cached). Toggle works offline. |
| **H7–8** | Adaptive polish | Spaced repetition; "next best" recommendation |
| **H8–9** | **Teacher Gabay classroom** | Lesson-brief → classroom scene (board + mascot + speech bubble); Vertex proxy for live tutor; cached fallback; `speechSynthesis` voice-out (offline-safe); Nano + online mic if time. |
| **H9–10** | UI polish + MATATAG badges | Every screen shows the competency ref + statement; home has "Magtanong kay Teacher Gabay" button. Clean, mobile-first. |
| **H10–11** | Demo rehearsal + buffer | Run the full demo script twice, including airplane mode |

**Hard rule:** if you're behind at H5, cut the tutor down to online-only (drop Nano), then if still behind cut the whole tutor. The offline core + MATATAG grounding is the whole win; tutor and Nano are bonuses, cut Nano first.

---

## 12. Demo script (3 min)

1. **Hook (15s):** "DepEd's own exam scores Grade 6 math at Low Proficiency — mid-30s out of 100. Watch this." → open app.
2. **Core loop (40s):** pick a competency (badge visible), read the Taglish explanation, answer 2 items, mastery bar moves.
3. **Enter the classroom (40s):** open a topic → lesson brief → step into Teacher Gabay's class. Tap the mic, *speak* a question in Taglish; Gabay teaches at the board and answers **out loud** in Taglish with a palengke example. "Online, you talk to your teacher — and it talks back, in your language."
4. **The offline moment (35s):** turn on **airplane mode**. Lessons keep working; ask Gabay again (typing now) — it still **speaks** the cached reply. "No signal: the mic turns off, but Teacher Gabay still talks and teaches."
5. **The Nano flex (20s, laptop only):** still offline, ask Gabay to "ipaliwanag mo ulit, mas simple" → on-device Gemini Nano answers live and reads it aloud. "No signal, and the AI is still running — on the device."
6. **MATATAG proof (20s):** tap a lesson, show the `G6 · NA · Percent` badge + official competency statement. "Every lesson maps to the current MATATAG curriculum."
7. **Close (15s):** "Offline-first, curriculum-grounded, Taglish-native, and it talks. Built for the learner with one bar of signal."

---

## 13. Judging-criteria mapping (Accenture cares about deployability + inclusion)

| Likely criterion | How Gabay scores |
|---|---|
| Real-world impact / inclusion | Offline-first = works in low-connectivity rural settings; targets the NAT-measured grade |
| Technical execution | PWA + service worker + persistent offline state, fully working |
| Alignment to problem | MATATAG-grounded (current curriculum), Taglish-native, mobile-first — hits every line of the brief |
| Innovation | Trilingual tutor across three AI tiers — Vertex (online), Gemini Nano (on-device offline), cached fallback — plus build-time generation, not a wrapper |
| Demo / clarity | The airplane-mode moment is memorable and unambiguous |

---

## 14. Stretch (only if ahead at H9)
- Second subject (G6 Science) — same engine, more content.
- Animated/talking mascot in the classroom (lip-sync to speechSynthesis).
- TTS read-aloud polish + Filipino voice selection.
- Tiny on-device "did you mean" for free-text math answers.

*Don't touch these until the core + offline + MATATAG grounding + Teacher Gabay are locked.*

---

## Appendix A — Claude Code kickoff prompt

Paste this into Claude Code in an empty folder to scaffold the app. (Full version also in the chat.)

> Build an offline-first PWA called **Gabay**, a Grade 6 Math study companion for Filipino learners, using **React 19 + Vite + Tailwind**. Requirements:
>
> 1. **Offline-first**: integrate `vite-plugin-pwa` (Workbox) with `registerType:'autoUpdate'` and precache all built assets (`**/*.{js,css,html,json,png,svg}`). The entire core experience must work with the network off.
> 2. **Content**: read from a bundled `src/content.json` (import it, don't fetch it). Schema per competency: `{ ref, domain, content_standard, competency, performance_standard, explanation:{en,fil,taglish}, worked_example, items:[{q,answer,type}] }`. Seed it with 6 Grade 6 MATATAG Number & Algebra competencies (percent: relate to fractions/decimals, identify percentage/rate/base, solve discount problems; ratio & proportion; operations on decimals; GCF/LCM). Use Filipino-context word problems (palengke discounts, sari-sari budgeting).
> 3. **Core loop**: a screen to pick a competency (show the `ref` + competency statement as a badge), display the explanation with an **EN / Filipino / Taglish** toggle, show the worked example, then present practice items one at a time with auto-checking for numeric/mcq answers.
> 4. **Adaptive engine**: per-competency mastery score 0–1 stored in **IndexedDB via `idb-keyval`**; correct → +0.1, wrong → −0.1 and re-queue sooner; a "What's next?" button surfaces the lowest-mastery competency. State must persist offline and across reloads.
> 5. **Teacher Gabay (classroom simulation)**: opening a topic shows a "lesson brief" (topic, MATATAG competency ref + statement, and a numbered "Ang gagawin mo" task list), then a "Pumasok sa Klase" button enters a **classroom scene** — a chalkboard at the front showing the current problem/worked example, the star-mascot teacher beside it with a speech bubble, and the student "at a desk" with an answer field, a "🙋 Itaas ang kamay" ask button, and a mic. The student writes/speaks in English, Tagalog, or Taglish; Gabay replies in the same register, teaching the active competency. Implement `askTeacherGabay(question, ref)` fallback chain: (a) on-device Gemini Nano if `'LanguageModel' in self` and available; else (b) if online, POST to `/api/tutor` proxy (placeholder for Vertex/Gemini); else (c) return the cached Taglish explanation. Cache replies in IndexedDB keyed `tutor:{ref}:{hash}`. No language detection — the trilingual behavior is the system prompt. No API keys in client code. The classroom is a visual reskin over the existing explanation + practice-item engine, not a new system.
> 6. **Voice**: Teacher Gabay reads every reply aloud using on-device `speechSynthesis` (prefer a `fil`/`tl` voice if available) — must work offline. The mic button is **enabled only when `navigator.onLine`** (toggle on `online`/`offline` events); use `SpeechRecognition` with `lang='fil-PH'` as a placeholder. Voice-out is core; voice-in is online-only.
> 7. **Mobile-first UI**: clean, large tap targets, works at 360px width. No accounts, no backend (except the tutor proxy), no localStorage/sessionStorage.
>
> Scaffold the project, create all files, and give me a `README` with run instructions. Then stop so I can review before we add content.
