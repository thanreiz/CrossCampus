# Gabay — An Offline-First AI Study Companion for Grade 6 Filipino Math Learners

**Team Name:** Cross Campus

**Group Members:**
- Ethan Dreiz Baltazar
- Paul Henry Dacalan
- Alea Grasha Masiglat
- Hannah Muñoz

---

## Problem Introduction

Gabay is an offline-first AI study companion for Grade 6 Filipino math learners, scoped in the build plan as a narrow, demo-ready Android product rather than a broad all-subject tutoring platform. Its strongest strategic claim is not that it uses AI, but that it is designed for the real delivery conditions many Filipino learners face: shared devices, intermittent connectivity, short study windows, and the need for clear, age-appropriate help.

That positioning is supported by official connectivity data. PSA reported that only 48.8% of households had internet access at home in 2024, even after a large improvement from 17.7% in 2019. In other words, an education product that assumes stable home internet is still misaligned with a large share of households.

## Problem Statement

The problem Gabay addresses is the lack of reliable, affordable, and curriculum-bounded math support that continues to work when connectivity is weak. The build plan addresses this through a local-first Android implementation, structured math-help flows, and a tightly scoped Grade 6 use case.

This matters because the latest official household ICT data show that internet availability remains uneven by region. PSA reported that household internet access at home in 2024 ranged from 68.7% in NCR and 61.3% in Central Luzon to 21.2% in Zamboanga Peninsula and 27.7% in BARMM. Gabay's offline-first design is therefore not just a technical preference; it is part of the product's fit to the market.

## Problem Gap

Most current solutions fall into one of three buckets: online-first learning apps, general-purpose AI chat tools, or human tutoring. Each can be useful, but each breaks in a different way for this use case. Online-first apps depend too heavily on connection quality. General AI tools are too open-ended for child-safe, curriculum-bounded elementary math help. Human tutoring is valuable but not universally accessible or affordable.

Gabay's wedge is to combine bounded grade-level tutoring, offline-first use, and lightweight learner loops such as diagnostics, practice, and guided explanation. That wedge is present in the build plan and is more defensible than a generic "AI for education" claim.

## Target Market

The clearest initial market is Grade 6 learners in connectivity-constrained households using Android, with parents, teachers, schools, NGOs, and CSR or LGU programs as the most practical channels.

For population context, the Philippines had 112,729,484 people as of 1 July 2024, according to PSA.

For infrastructure context, the same official ICT release says 13.56 million households had internet access at home in 2024, equal to 48.8% of all households. That is highly relevant to Gabay's go-to-market design because it suggests a large offline-need segment still exists.

## Audience

The end-user audience is the learner; the activating audience is usually the adult around the learner.

For learners, the intended experience is quick, guided, non-intimidating math support on a device they can actually access. For parents and guardians, the value is a study companion that does not collapse without internet and does not require heavy supervision. For teachers and deployers, the value is a bounded and implementable support tool, not an ungoverned chatbot. These audience assumptions align with the build plan and with the official household connectivity context.

## Competitive Analysis

The most defensible competitive framing for judges is category-based:

| Alternative | What it does well | Where it breaks for this problem | Gabay position |
|---|---|---|---|
| General AI chat assistant | Flexible explanations | Too open-ended; weak age and curriculum control | Grade-bounded, safer, more structured |
| Online practice platform | Good for quizzes and teacher-led activities | Heavy internet dependency | Offline-first learner support |
| Static offline content app | Reliable access | Low interactivity and personalization | Guided, interactive study loop |
| Human tutor | High personalization | Limited scale and affordability | Supplemental, scalable support |

The point is not that Gabay replaces all alternatives. The point is that it occupies a neglected product space: interactive learning support that still works under household connectivity constraints.

## Business Model including System Architecture

A strong pitch version of the business model is:

Gabay launches with a freemium learner app and a B2B2G / institution-supported channel. Families can use a limited free version, while schools, NGOs, or sponsors can fund structured deployments, localized content packs, and progress reporting. This avoids over-reliance on small consumer payments while keeping the product usable for households.

The system architecture should be described as **Android-first, local-first, cloud-optional**. The build plan already points to an app that keeps core learning functions offline where possible, with optional server-side syncing or enhancement when connectivity exists. That is the right architecture story to pitch because it mirrors the PSA connectivity evidence and the hackathon implementation constraint.

## Guardrails

Gabay should explicitly commit to the following product guardrails:

It stays inside a Grade 6 math scope until outcomes justify expansion. It gives stepwise help and checking, not just answer dumps. It defaults to safe refusal or redirection for out-of-scope prompts. It minimizes learner-data collection. It treats online features as enhancements, not as requirements. These guardrails are consistent with the build plan's bounded MVP design.

## How to Use and Implement

A learner downloads the Android app, takes a short diagnostic, and is routed into topic-specific practice and support loops. The assistant explains, asks follow-up questions, and gives structured help around Grade 6 math tasks. When the device is online, progress can sync and content can update. When the device is offline, the learner can still continue with core study flows. This is the cleanest way to present the product in a demo because it directly reflects the build plan's MVP.

## Persona, Context, and Constraint

A representative persona is a Grade 6 learner using a shared Android device at home, with inconsistent connectivity and limited tolerance for complex app flows. That context fits both the build plan and the official 2024 household internet picture.

The main constraints to acknowledge openly in the pitch are: offline reliability, short build time, narrow content scope, and the need to avoid making unsupported learning-outcome claims before pilot evidence exists.

## Future Development

After the hackathon, the right roadmap is not "expand to every grade immediately." It is:

Prove usage and retention in one slice of Grade 6 math; improve explanation quality and assessment loops; connect teacher or parent summaries; expand content breadth only after the narrow use case works.

DepEd's official site also shows that future alignment paths exist through Open Educational Resources and Project Bukas / Paaralang Bukas public-data infrastructure.

## Call to Action

The strongest ask is:

Back Gabay as a pilot for connectivity-constrained Grade 6 learners. Give it one school cluster, one NGO program, or one sponsored deployment, and judge it on whether an offline-first AI study companion improves completion, confidence, and repeat usage under real conditions. That is a sharper and more credible ask than claiming immediate national scale.

## Market Sizing (Assumptions Stated Inline)

Because an official grade-level DepEd enrollment table was not retrieved in this session, the figures below are intentionally labeled as estimates.

- **TAM population [ESTIMATE]:** ~1.72 million learners. Assumption: Grade 6 is roughly one-sixth of an [unverified] elementary population of about 10.3 million mentioned in the draft; this is a planning estimate, not an official Grade 6 count.
- **TAM indicative value [ESTIMATE]:** ~₱172 million to ~₱516 million annually. Assumption: effective monetization of ₱100 to ₱300 per learner per year, which is a pricing assumption, not a market fact.
- **SAM population [ESTIMATE]:** ~0.84 million to ~0.88 million learners. Assumption: early strongest fit is among households still lacking home internet; PSA says 48.8% of households had it in 2024, implying roughly 51.2% did not. Applying that as a proxy filter to the estimated TAM yields roughly this SAM range.
- **SAM indicative value [ESTIMATE]:** ~₱84 million to ~₱264 million annually.
- **SOM population [ESTIMATE]:** 20,000 to 50,000 learners in an early deployment phase. Assumption: a realistic first few institutional deployments, not national penetration.
- **SOM indicative value [ESTIMATE]:** ~₱2 million to ~₱15 million annually, depending on consumer, sponsor, or institutional pricing mix.

These should be spoken as scenario ranges in the pitch, not as audited market facts.

## Confidence and Gaps

The claims that most need human verification against a primary or offline/paywalled source before they appear on slides are:

- The exact DepEd NAT 2024 mathematics figures, including the Grade 10 and Grade 12 breakdowns;
- The exact OECD PISA 2022 Philippines Level 2 math share;
- The exact IEA TIMSS 2019 benchmark distribution behind the "19% / 81%" claim;
- The exact DepEd grade-level enrollment, especially official Grade 6 counts;
- The exact public-schools-without-internet figure attributed to the 2025 SONA or related DICT/DepEd data.

The highest-confidence findings are the ones grounded directly in currently accessible official sources: the 2024 PSA population count, the 2024 and 2019 PSA household internet figures, the existence of DepEd OER and Project Bukas, and the product scope described in the build plan.

## Sources / References

1. PSA NICTHS — household internet access: https://psa.gov.ph/statistics/nicths/node/1684077807
2. PSA Population and Housing — 2024 population count: https://psa.gov.ph/statistics/population-and-housing/node/1684077791
3. DepEd official site — OER, Project Bukas: https://www.deped.gov.ph/
4. TIMSS (Trends in International Mathematics and Science Study): https://en.wikipedia.org/wiki/Trends_in_International_Mathematics_and_Science_Study
5. PISA (Programme for International Student Assessment): https://en.wikipedia.org/wiki/Programme_for_International_Student_Assessment
6. 2025 State of the Nation Address (Philippines): https://en.wikipedia.org/wiki/2025_State_of_the_Nation_Address_%28Philippines%29
7. Freedom of Information Order (Philippines): https://en.wikipedia.org/wiki/Freedom_of_Information_Order_%28Philippines%29
