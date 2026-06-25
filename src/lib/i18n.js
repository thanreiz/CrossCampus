// Global UI string table. Every user-facing label flows through t(key, lang)
// so picking a language in the header switches the WHOLE app — nav, buttons,
// lessons, feedback, assessments, transcripts — except the app title "Gabay".
//
// Languages match content.json + lang.js: 'en' (English), 'fil' (Tagalog),
// 'taglish' (natural Tagalog-English mix, the default).
//
// localize() handles content fields that may be a plain string OR a
// { en, fil, taglish } object, so curriculum items can be partially translated
// (pure math stems stay as one string; word problems / solutions translate).

import { DEFAULT_LANG } from './lang.js'

export const STRINGS = {
  // ---- Splash ----
  'splash.banner': {
    en: 'Learn Math even with no signal.',
    fil: 'Matuto ng Math kahit walang signal.',
    taglish: 'Matuto ng Math kahit walang signal.',
  },
  'splash.start': { en: 'START', fil: 'MAGSIMULA', taglish: 'MAGSIMULA' },
  'splash.offline': { en: '100% OFFLINE LEARNING', fil: '100% OFFLINE NA PAG-AARAL', taglish: '100% OFFLINE LEARNING' },

  // ---- shared / nav ----
  'common.back': { en: 'Back', fil: 'Bumalik', taglish: 'Bumalik' },
  'common.exit': { en: 'Exit', fil: 'Lumabas', taglish: 'Lumabas' },
  'common.online': { en: 'Online', fil: 'Online', taglish: 'Online' },
  'common.offline': { en: 'Offline', fil: 'Offline', taglish: 'Offline' },
  'common.language': { en: 'Language', fil: 'Wika', taglish: 'Wika' },
  'common.mastery': { en: 'Mastery', fil: 'Kahusayan', taglish: 'Mastery' },
  'common.question': { en: 'Question', fil: 'Tanong', taglish: 'Tanong' },
  'common.yourAnswer': { en: 'Your answer', fil: 'Sagot mo', taglish: 'Sagot mo' },
  'common.correctAnswer': { en: 'Correct answer', fil: 'Tamang sagot', taglish: 'Tamang sagot' },
  'common.explanation': { en: 'Explanation', fil: 'Paliwanag', taglish: 'Paliwanag' },
  'common.feedback': { en: 'Feedback', fil: 'Feedback', taglish: 'Feedback' },
  'common.correct': { en: 'Correct', fil: 'Tama', taglish: 'Tama' },
  'common.wrong': { en: 'Wrong', fil: 'Mali', taglish: 'Mali' },
  'common.next': { en: 'Next', fil: 'Susunod', taglish: 'Susunod' },
  'common.finish': { en: 'Finish', fil: 'Tapusin', taglish: 'Tapusin' },
  'common.done': { en: 'Done', fil: 'Tapos', taglish: 'Tapos' },
  'common.answerPlaceholder': { en: 'Type your answer...', fil: 'Isulat ang sagot...', taglish: 'Isulat ang sagot...' },

  // ---- nav tabs ----
  'nav.lessons': { en: 'Lessons', fil: 'Aralin', taglish: 'Lessons' },
  'nav.practice': { en: 'Practice', fil: 'Pagsasanay', taglish: 'Practice' },
  'nav.games': { en: 'Games', fil: 'Laro', taglish: 'Games' },
  'nav.profile': { en: 'Profile', fil: 'Profile', taglish: 'Profile' },

  // ---- Home ----
  'home.hallwayTag': { en: 'Classroom Hallway', fil: 'Hallway ng Silid-Aralan', taglish: 'Hallway ng Silid-Aralan' },
  'home.greeting': { en: 'Hello, Ka-Gabay!', fil: 'Kumusta, Ka-Gabay!', taglish: 'Kumusta, Ka-Gabay!' },
  'home.subtitle': { en: 'Where shall we go today?', fil: 'Saan tayo pupunta ngayon?', taglish: 'Saan tayo pupunta ngayon?' },
  'home.open': { en: 'OPEN', fil: 'BUKAS', taglish: 'OPEN' },
  'home.lessons.title': { en: 'Lessons', fil: 'Mga Aralin', taglish: 'Mga Aralin' },
  'home.lessons.status': { en: 'New lesson', fil: 'Bagong aralin', taglish: 'Bagong aralin' },
  'home.lessons.cta': { en: 'Open', fil: 'Buksan', taglish: 'Buksan' },
  'home.classroom.title': { en: 'Teacher Gabay', fil: 'Teacher Gabay', taglish: 'Teacher Gabay' },
  'home.classroom.status': { en: 'AI tutor', fil: 'AI tutor', taglish: 'AI tutor' },
  'home.classroom.cta': { en: 'Enter', fil: 'Pasukin', taglish: 'Pasukin' },
  'home.games.title': { en: 'Store Game', fil: 'Tindahan Game', taglish: 'Tindahan Game' },
  'home.games.status': { en: 'Playable', fil: 'Nalalaro', taglish: 'Playable' },
  'home.games.cta': { en: 'Play', fil: 'Laruin', taglish: 'Laruin' },

  // ---- Start Choice ----
  'start.heading': { en: 'How would you like to start?', fil: 'Paano ka magsisimula?', taglish: 'Paano ka magsisimula?' },
  'start.sub': {
    en: 'Do your best in math, Explorer! Pick what you want to do.',
    fil: 'Galingan mo sa math, Explorer! Piliin mo kung ano ang gusto mong gawin.',
    taglish: 'Galingan mo sa math, Explorer! Piliin mo kung ano ang gusto mong gawin.',
  },
  'start.continueTag': { en: '01 - Continue', fil: '01 - Tuloy', taglish: '01 - Tuloy' },
  'start.continueTitle': { en: 'Continue the lesson', fil: 'Ituloy ang aralin', taglish: 'Ituloy ang aralin' },
  'start.masteryProgress': { en: 'Mastery Progress', fil: 'Progreso ng Kahusayan', taglish: 'Mastery Progress' },
  'start.startNow': { en: 'Start now', fil: 'Magsimula na', taglish: 'Magsimula na' },
  'start.browseTag': { en: '02 - Browse', fil: '02 - Tingnan', taglish: '02 - Tingnan' },
  'start.browseTitle': { en: 'View all topics', fil: 'Tingnan lahat ng topics', taglish: 'Tingnan lahat ng topics' },
  'start.browseSub': {
    en: 'Find the full list of Grade 6 lessons.',
    fil: 'Hanapin ang buong listahan ng mga aralin sa Grade 6.',
    taglish: 'Hanapin ang buong listahan ng mga aralin sa Grade 6.',
  },
  'start.viewList': { en: 'View the list', fil: 'Tingnan ang listahan', taglish: 'Tingnan ang listahan' },

  // ---- Topic Picker ----
  'topics.heading': { en: 'What shall we study today?', fil: 'Anong aaralin natin ngayon?', taglish: 'Anong aaralin natin ngayon?' },
  'topics.sub': { en: 'Pick a topic and start practising.', fil: 'Pumili ng topic at magsimula ng practice.', taglish: 'Pumili ng topic at magsimula ng practice.' },
  'topics.all': { en: 'All', fil: 'Lahat', taglish: 'Lahat' },

  // ---- Lesson Brief ----
  'brief.contentStandard': { en: 'Content Standard', fil: 'Pamantayang Nilalaman', taglish: 'Content Standard' },
  'brief.whatYouDo': { en: 'What you will do', fil: 'Ang gagawin mo', taglish: 'Ang gagawin mo' },
  'brief.task.understand': {
    en: 'Understand the lesson: {topic}.',
    fil: 'Intindihin ang aralin: {topic}.',
    taglish: 'Intindihin ang aralin: {topic}.',
  },
  'brief.task.answer': {
    en: "Answer Teacher Gabay's questions on the board.",
    fil: 'Sagutin ang mga tanong ni Teacher Gabay sa pisara.',
    taglish: 'Sagutin ang mga tanong ni Teacher Gabay sa pisara.',
  },
  'brief.task.ask': {
    en: 'Ask if something is unclear — raise your hand!',
    fil: 'Magtanong kung may hindi malinaw - itaas ang kamay!',
    taglish: 'Magtanong kung may hindi malinaw - itaas ang kamay!',
  },
  'brief.lessonProgress': { en: 'Lesson Progress', fil: 'Progreso ng Aralin', taglish: 'Lesson Progress' },
  'brief.questions': { en: 'Questions', fil: 'Mga Tanong', taglish: 'Mga Tanong' },
  'brief.level': { en: 'Level', fil: 'Antas', taglish: 'Antas' },
  'brief.ready': { en: "I'm ready inside the class. Let's go!", fil: 'Handa na ako sa loob ng klase. Tara!', taglish: 'Handa na ako sa loob ng klase. Tara!' },
  'brief.enter2d': { en: 'Enter 2D Class', fil: 'Pumasok sa 2D Klase', taglish: 'Pumasok sa 2D Klase' },
  'brief.enter3d': { en: '3D Class (beta)', fil: '3D Klase (beta)', taglish: '3D Klase (beta)' },

  // ---- Classroom (2D) ----
  'class.tab.explain': { en: 'Explanation', fil: 'Paliwanag', taglish: 'Paliwanag' },
  'class.tab.example': { en: 'Example', fil: 'Halimbawa', taglish: 'Halimbawa' },
  'class.tab.practice': { en: 'Practice', fil: 'Pagsasanay', taglish: 'Pagsasanay' },
  'class.listenAgain': { en: 'Listen again', fil: 'Pakinggan ulit', taglish: 'Pakinggan ulit' },
  'class.play': { en: 'Resume', fil: 'Ituloy', taglish: 'Ituloy' },
  'class.pause': { en: 'Pause', fil: 'I-pause', taglish: 'I-pause' },
  'class.raiseHand': { en: 'Raise your hand', fil: 'Itaas ang kamay', taglish: 'Itaas ang kamay' },
  'class.askPlaceholder': { en: 'Ask Teacher Gabay...', fil: 'Itanong kay Teacher Gabay...', taglish: 'Itanong kay Teacher Gabay...' },
  'class.speak': { en: 'Speak', fil: 'Magsalita', taglish: 'Magsalita' },
  'class.mic': { en: 'Mic', fil: 'Mic', taglish: 'Mic' },
  'class.micStop': { en: 'Stop', fil: 'Itigil', taglish: 'Itigil' },
  'class.ask': { en: 'Ask', fil: 'Tanong', taglish: 'Tanong' },
  'class.listening': { en: 'Listening... one moment.', fil: 'Pinapakinggan kita... sandali lang.', taglish: 'Pinapakinggan kita... sandali lang.' },
  'class.listeningShort': { en: 'One moment, I am listening...', fil: 'Sandali, pinapakinggan kita...', taglish: 'Sandali, pinapakinggan kita...' },
  'class.offlineNote': {
    en: 'Offline: Gabay still answers using on-device AI or cached explanations. Mic needs internet.',
    fil: 'Offline: sasagot pa rin si Gabay gamit ang on-device AI o naka-cache na paliwanag. Mic ay online lang.',
    taglish: 'Offline: sasagot pa rin si Gabay gamit ang on-device AI o cached na paliwanag. Mic ay online lang.',
  },
  'class.micOfflineTitle': { en: 'Mic — needs internet', fil: 'Mic — kailangan ng internet', taglish: 'Mic — kailangan ng internet' },
  'class.askError': { en: 'There was a problem answering. Please try again.', fil: 'May problema sa pagsagot. Subukan ulit.', taglish: 'May problema sa pagsagot. Subukan ulit.' },
  'class.startPractice': { en: 'Start the practice', fil: 'Simulan ang pagsasanay', taglish: 'Simulan ang pagsasanay' },
  'class.answer': { en: 'Answer', fil: 'Sumagot', taglish: 'Sumagot' },
  'class.repeat': { en: 'Repeat', fil: 'Ulitin', taglish: 'Ulitin' },
  'class.source.nano': { en: 'On-device (offline)', fil: 'On-device (offline)', taglish: 'On-device (offline)' },
  'class.source.online': { en: 'Teacher Gabay (online)', fil: 'Teacher Gabay (online)', taglish: 'Teacher Gabay (online)' },
  'class.source.cached': { en: 'Cached explanation', fil: 'Naka-cache na paliwanag', taglish: 'Naka-cache na paliwanag' },
  'class.reviewMissed': { en: "Let's review what we missed:", fil: 'Balikan natin ang mga namali:', taglish: 'Balikan natin ang mga namali:' },
  // dynamic teacher lines ({n}=number, {total}=total)
  'class.bubble.intro': {
    en: 'Question {n} of {total}: Write your answer below. You can do it!',
    fil: 'Tanong {n} sa {total}: Isulat ang sagot sa baba. Kaya mo ’yan!',
    taglish: 'Tanong {n} sa {total}: Isulat ang sagot sa baba. Kaya mo ’yan!',
  },
  'class.bubble.done': {
    en: 'All done! {correct} of {total} correct. Great work, scholar!',
    fil: 'Tapos na! {correct} sa {total} ang tama. Magaling, iskolar!',
    taglish: 'Tapos na! {correct} sa {total} ang tama. Magaling, iskolar!',
  },
  'class.welcome3d': {
    en: 'Welcome to class! Walk to the board to begin.',
    fil: 'Maligayang pagdating sa klase! Lumakad sa pisara para magsimula.',
    taglish: 'Maligayang pagdating sa klase! Lakad sa pisara para magsimula.',
  },

  // ---- Summary (shared by Classroom / Games / 3D) ----
  'summary.done': { en: 'All done!', fil: 'Tapos na!', taglish: 'Tapos na!' },
  'summary.scoreLine': { en: '{correct} / {total} correct', fil: '{correct} / {total} tama', taglish: '{correct} / {total} tama' },

  // ---- Progress (Profile) ----
  'progress.title': { en: 'My Progress', fil: 'Aking Progreso', taglish: 'Aking Progreso' },
  'progress.avg': { en: 'Average mastery: {pct}%', fil: 'Karaniwang kahusayan: {pct}%', taglish: 'Karaniwang mastery: {pct}%' },
  'progress.tab.mastery': { en: 'Mastery', fil: 'Kahusayan', taglish: 'Mastery' },
  'progress.tab.review': { en: 'Practice', fil: 'Pagsasanay', taglish: 'Pagsasanay' },
  'progress.nextUp': { en: 'Study this next:', fil: 'Susunod na dapat pag-aralan:', taglish: 'Susunod na dapat pag-aralan:' },
  'progress.start': { en: 'Start', fil: 'Magsimula', taglish: 'Magsimula' },
  'progress.sortBy': { en: 'Sort by progress', fil: 'Ayusin ayon sa progreso', taglish: 'Ayusin ayon sa progreso' },
  'progress.asc': { en: 'Ascending', fil: 'Pataas', taglish: 'Pataas' },
  'progress.desc': { en: 'Descending', fil: 'Pababa', taglish: 'Pababa' },
  'progress.empty.title': { en: 'No practice yet', fil: 'Wala pang pagsasanay', taglish: 'Wala pang pagsasanay' },
  'progress.empty.sub': {
    en: 'Answer questions in Practice or Games — your review will appear here.',
    fil: 'Sagutan ang mga tanong sa Practice o Games — lalabas dito ang review mo.',
    taglish: 'Sagutan ang mga tanong sa Practice o Games — lalabas dito ang review mo.',
  },
  'progress.yourAnswers': { en: 'What you answered', fil: 'Mga sinagot mo', taglish: 'Mga sinagot mo' },
  'progress.clear': { en: 'Clear', fil: 'Burahin', taglish: 'Burahin' },

  // ---- mastery band labels (the "In Progress" change lives here) ----
  'band.red': { en: 'Just starting', fil: 'Simulan na natin', taglish: 'Simulan na natin' },
  'band.orange': { en: 'In Progress', fil: 'Kaya pa', taglish: 'Kaya pa' },
  'band.green': { en: 'Doing great', fil: 'Mabuti', taglish: 'Magaling na' },

  // ---- Games (Tindahan) ----
  'games.title': { en: 'Gabay Games', fil: 'Gabay Games', taglish: 'Gabay Games' },
  'games.store': { en: 'Store Game', fil: 'Tindahan Game', taglish: 'Tindahan Game' },
  'games.tagline': {
    en: 'Compute totals, discounts, ratios, and percent while you sell.',
    fil: 'Mag-compute ng total, diskwento, ratio, at percent habang nagtitinda.',
    taglish: 'Mag-compute ng total, discount, ratio, at percent habang nagtitinda.',
  },
  'games.howMany': { en: 'How many questions will you answer?', fil: 'Ilang tanong ang sasagutan mo?', taglish: 'Ilang tanong ang sasagutan mo?' },
  'games.minMax': { en: 'Minimum 5, maximum 20 questions.', fil: 'Minimum 5, maximum 20 na tanong.', taglish: 'Minimum 5, maximum 20 na tanong.' },
  'games.startStore': { en: 'Open the Store ({n} questions)', fil: 'Simulan ang Tindahan ({n} tanong)', taglish: 'Simulan ang Tindahan ({n} tanong)' },
  'games.closed': { en: 'Store closed!', fil: 'Tindahan sarado!', taglish: 'Tindahan sarado!' },
  'games.earned': { en: 'You earned: {coins} coins', fil: 'Kita mo: {coins} coins', taglish: 'Kita mo: {coins} coins' },
  'games.answered': { en: 'Answered', fil: 'Sinagot', taglish: 'Sinagot' },
  'games.coins': { en: 'Coins', fil: 'Coins', taglish: 'Coins' },
  'games.customer': { en: 'Customer', fil: 'Suki', taglish: 'Customer' },
  'games.pay': { en: 'Pay', fil: 'Bayaran', taglish: 'Bayaran' },
  'games.playAgain': { en: 'Play again', fil: 'Laro ulit', taglish: 'Laro ulit' },

  // ---- 3D Classroom HUD ----
  '3d.preparing': { en: 'Preparing the 3D class...', fil: 'Inihahanda ang 3D klase...', taglish: 'Inihahanda ang 3D klase...' },
  '3d.theme': { en: 'Theme', fil: 'Tema', taglish: 'Tema' },
  '3d.changeRoom': { en: 'Change the room', fil: 'Palitan ang klase', taglish: 'Palitan ang klase' },
  '3d.answerBoard': { en: 'Answer', fil: 'Sagutin', taglish: 'Sagutin' },
  '3d.hintAtBoard': { en: 'Tap Answer or press E / F', fil: 'I-tap ang Sagutin o pindutin ang E / F', taglish: 'Tap Sagutin o pindutin ang E / F' },
  '3d.hintMove': {
    en: 'Joystick to move · WASD on keyboard · scroll to zoom',
    fil: 'Joystick para gumalaw · WASD sa keyboard · scroll para mag-zoom',
    taglish: 'Joystick para gumalaw · WASD sa keyboard · scroll para mag-zoom',
  },
  '3d.lookHint': { en: 'Drag the right side to look around', fil: 'I-drag ang kanang bahagi para tumingin sa paligid', taglish: 'I-drag ang kanang bahagi para tumingin sa paligid' },
  '3d.zoomIn': { en: 'Zoom in', fil: 'Zoom in', taglish: 'Zoom in' },
  '3d.zoomOut': { en: 'Zoom out', fil: 'Zoom out', taglish: 'Zoom out' },
  '3d.board.correct': { en: 'Correct!', fil: 'Tama!', taglish: 'Tama!' },
  '3d.board.tryAgain': { en: 'Try again', fil: 'Subukan ulit', taglish: 'Subukan ulit' },
  '3d.board.ready': { en: 'The class is ready.', fil: 'Handa na ang klase.', taglish: 'Handa na ang klase.' },

  // ---- 3D renovation theme names ----
  'theme.classic': { en: 'Classic', fil: 'Klasiko', taglish: 'Klasiko' },
  'theme.forest': { en: 'Forest', fil: 'Gubat', taglish: 'Gubat' },
  'theme.ocean': { en: 'Ocean', fil: 'Dagat', taglish: 'Dagat' },
  'theme.sunset': { en: 'Sunset', fil: 'Takipsilim', taglish: 'Takipsilim' },
  'theme.night': { en: 'Night', fil: 'Gabi', taglish: 'Gabi' },
}

// t('home.greeting', 'en') -> string. Unknown keys return the key (visible in
// dev). vars fills {placeholders}: t('games.earned', lang, { coins: 12 }).
export function t(key, lang = DEFAULT_LANG, vars) {
  const entry = STRINGS[key]
  if (!entry) return key
  let s = entry[lang] ?? entry[DEFAULT_LANG] ?? entry.en ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v))
    }
  }
  return s
}

// Curried helper for components: const tt = makeT(lang); tt('home.greeting').
export function makeT(lang = DEFAULT_LANG) {
  return (key, vars) => t(key, lang, vars)
}

// Content fields may be a plain string (shared across languages, e.g. a pure
// math stem like "15.7 + 9.86 = ?") or a { en, fil, taglish } object. Resolve
// to the current language, falling back gracefully.
export function localize(value, lang = DEFAULT_LANG) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value[lang] ?? value[DEFAULT_LANG] ?? value.en ?? ''
  return String(value)
}
