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

const l = (en, fil = en, taglish = fil) => ({ en, fil, taglish })

const GRADE_GAME_COPY = {
  'g1-number-train': [l('Number Train', 'Tren ng Numero'), l('Count, order, and build numbers as the train moves.', 'Magbilang, mag-ayos, at bumuo ng numero habang umaandar ang tren.', 'Count, order, at bumuo ng numbers habang umaandar ang train.'), l('Conductor', 'Konduktor'), l('All aboard', 'Sakay na')],
  'g1-sari-sari-shop': [l('Sari-Sari Shop'), l('Add, subtract, and count money for every customer.', 'Magdagdag, magbawas, at magbilang ng pera para sa bawat mamimili.', 'Add, subtract, at magbilang ng money para sa bawat customer.'), l('Customer', 'Mamimili'), l('Sell', 'Magbenta')],
  'g1-shape-time-playground': [l('Shape & Time Playground', 'Palaruan ng Hugis at Oras'), l('Explore shapes, lengths, turns, clocks, and calendars.', 'Tuklasin ang mga hugis, haba, pagliko, orasan, at kalendaryo.', 'Explore shapes, lengths, turns, clocks, at calendars.'), l('Playmate', 'Kalaro'), l('Play', 'Maglaro')],
  'g1-pattern-picnic': [l('Pattern Picnic', 'Piknik ng Pattern'), l('Spot patterns, share fractions, and read picture graphs.', 'Hanapin ang pattern, magbahagi ng fraction, at bumasa ng pictograph.', 'Spot patterns, share fractions, at read pictographs.'), l('Picnic friend', 'Ka-piknik'), l('Share', 'Magbahagi')],
  'g2-number-city': [l('Number City', 'Lungsod ng Numero'), l('Navigate numbers to 1,000 using place value and patterns.', 'Maglakbay sa mga numero hanggang 1,000 gamit ang place value at pattern.', 'Navigate numbers to 1,000 gamit ang place value at patterns.'), l('City guide', 'Gabay sa lungsod'), l('Explore', 'Tuklasin')],
  'g2-market-math': [l('Market Math', 'Math sa Palengke'), l('Add, subtract, regroup, and solve money problems.', 'Magdagdag, magbawas, mag-regroup, at lumutas ng problemang may pera.', 'Add, subtract, regroup, at solve money problems.'), l('Shopper', 'Mamimili'), l('Pay', 'Magbayad')],
  'g2-sharing-camp': [l('Sharing Camp', 'Kampo ng Pagbabahagi'), l('Make equal groups, multiply, divide, and share fractions.', 'Bumuo ng pantay na grupo, mag-multiply, mag-divide, at magbahagi ng fraction.', 'Make equal groups, multiply, divide, at share fractions.'), l('Camper', 'Kamping'), l('Share', 'Magbahagi')],
  'g2-measure-picture-lab': [l('Measure & Picture Lab', 'Lab ng Sukat at Larawan'), l('Measure shapes and time, then read pictographs and perimeter.', 'Sukatin ang hugis at oras, saka bumasa ng pictograph at perimeter.', 'Measure shapes and time, then read pictographs and perimeter.'), l('Lab partner', 'Ka-lab'), l('Measure', 'Sukatin')],
  'g3-number-expedition': [l('Number Expedition', 'Ekspedisyon ng Numero'), l('Explore numbers to 10,000 by rounding, comparing, and ordering.', 'Tuklasin ang mga numero hanggang 10,000 sa pag-round, compare, at order.', 'Explore numbers to 10,000 by rounding, comparing, at ordering.'), l('Explorer', 'Manlalakbay'), l('Navigate', 'Maglakbay')],
  'g3-market-masters': [l('Market Masters', 'Mga Mahusay sa Palengke'), l('Use money, operations, patterns, and fractions at the market.', 'Gamitin ang pera, operations, pattern, at fraction sa palengke.', 'Use money, operations, patterns, at fractions sa market.'), l('Vendor', 'Tindero'), l('Trade', 'Makipagpalitan')],
  'g3-measure-shape-lab': [l('Measure & Shape Lab', 'Lab ng Sukat at Hugis'), l('Investigate area, lines, mass, capacity, and symmetry.', 'Siyasatin ang area, linya, mass, capacity, at symmetry.', 'Investigate area, lines, mass, capacity, at symmetry.'), l('Scientist', 'Siyentista'), l('Test', 'Subukan')],
  'g3-data-carnival': [l('Data Carnival', 'Karnabal ng Data'), l('Run experiments, read bar graphs, and predict chances.', 'Magsagawa ng experiment, bumasa ng bar graph, at hulaan ang tsansa.', 'Run experiments, read bar graphs, at predict chances.'), l('Game host', 'Tagapangasiwa'), l('Play', 'Maglaro')],
  'g4-big-number-mission': [l('Big Number Mission', 'Misyon ng Malalaking Numero'), l('Complete missions with large numbers, operations, and patterns.', 'Tapusin ang mga misyon gamit ang malalaking numero, operations, at pattern.', 'Complete missions with big numbers, operations, at patterns.'), l('Mission control', 'Kontrol ng misyon'), l('Launch', 'Ilunsad')],
  'g4-fraction-decimal-kitchen': [l('Fraction & Decimal Kitchen', 'Kusina ng Fraction at Decimal'), l('Mix fractions, factors, multiples, and decimals.', 'Paghaluin ang fraction, factor, multiple, at decimal.', 'Mix fractions, factors, multiples, at decimals.'), l('Chef', 'Kusinero'), l('Cook', 'Magluto')],
  'g4-geometry-workshop': [l('Geometry Workshop', 'Pagawaan ng Geometry'), l('Build with angles, polygons, perimeter, conversions, and symmetry.', 'Bumuo gamit ang angle, polygon, perimeter, conversion, at symmetry.', 'Build with angles, polygons, perimeter, conversions, at symmetry.'), l('Builder', 'Tagabuo'), l('Build', 'Bumuo')],
  'g4-data-studio': [l('Data Studio', 'Studio ng Data'), l('Create, read, and solve problems with tables and line graphs.', 'Gumawa, bumasa, at lumutas gamit ang table at line graph.', 'Create, read, at solve with tables and line graphs.'), l('Analyst', 'Tagasuri'), l('Analyze', 'Suriin')],
  'g5-time-zone-mission': [l('Time Zone Mission', 'Misyon sa Time Zone'), l('Convert clock systems and compare time around the world.', 'Mag-convert ng oras at maghambing ng time sa iba’t ibang panig ng mundo.', 'Convert clock systems at compare time around the world.'), l('Navigator', 'Tagapaglayag'), l('Travel', 'Maglakbay')],
  'g5-fraction-decimal-cafe': [l('Fraction & Decimal Café', 'Kapihan ng Fraction at Decimal'), l('Serve up fraction and decimal operations with every order.', 'Gamitin ang fraction at decimal operations sa bawat order.', 'Serve fraction and decimal operations sa bawat order.'), l('Guest', 'Bisita'), l('Serve', 'Ihain')],
  'g5-data-detective': [l('Data Detective', 'Detektib ng Data'), l('Investigate factors, graphs, inferences, and probability.', 'Imbestigahan ang factor, graph, inference, at probability.', 'Investigate factors, graphs, inferences, at probability.'), l('Detective', 'Detektib'), l('Investigate', 'Imbestigahan')],
  'g5-solid-builder': [l('Solid Builder', 'Tagabuo ng Solid Figures'), l('Design solids, nets, surface area, volume, and rotations.', 'Magdisenyo ng solid, net, surface area, volume, at rotation.', 'Design solids, nets, surface area, volume, at rotations.'), l('Architect', 'Arkitekto'), l('Build', 'Bumuo')],
}

const GRADE_GAME_STRINGS = Object.fromEntries(Object.entries(GRADE_GAME_COPY).flatMap(([key, [name, tagline, actor, action]]) => [
  [`games.${key}.name`, name],
  [`games.${key}.tagline`, tagline],
  [`games.${key}.actor`, actor],
  [`games.${key}.action`, action],
  [`games.${key}.start`, l(`Start ${name.en} ({n} questions)`, `Simulan ang ${name.fil} ({n} tanong)`, `Start ${name.taglish} ({n} questions)`) ],
  [`games.${key}.closed`, l(`${name.en} complete!`, `Tapos na ang ${name.fil}!`, `Complete na ang ${name.taglish}!`) ],
]))

export const STRINGS = {
  // ---- Splash ----
  'splash.banner': {
    en: 'Learn Math even with no signal.',
    fil: 'Matuto ng Math kahit walang signal.',
    taglish: 'Matuto ng Math kahit walang signal.',
  },
  'splash.start': { en: 'START', fil: 'MAGSIMULA', taglish: 'MAGSIMULA' },
  'splash.subtitle': {
    en: 'Grades 1–6 Math · Multilingual · Offline-first',
    fil: 'Math para sa Grade 1–6 · Maraming wika · Offline',
    taglish: 'Grades 1–6 Math · Multilingual · Offline-first',
  },
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
  'common.needAnswer': { en: 'Type your answer first.', fil: 'Isulat muna ang sagot.', taglish: 'Isulat muna ang sagot.' },
  'common.needNumber': { en: 'Type a number.', fil: 'Magbigay ng numero.', taglish: 'Mag-type ng number.' },
  'common.yes': { en: 'Yes', fil: 'Oo', taglish: 'Oo' },
  'common.no': { en: 'No', fil: 'Hindi', taglish: 'Hindi' },
  'questions.generating': { en: 'Preparing your questions…', fil: 'Inihahanda ang mga tanong…', taglish: 'Preparing your questions…' },
  'questions.generatingSub': { en: 'Teacher Gabay is building this practice session.', fil: 'Inihahanda ni Teacher Gabay ang pagsasanay mo.', taglish: 'Binubuo ni Teacher Gabay ang practice session mo.' },

  // ---- Onboarding / grade ----
  'onboarding.step': { en: 'Step {step} of 4', fil: 'Hakbang {step} sa 4', taglish: 'Step {step} of 4' },
  'onboarding.grade': { en: 'What grade are you in?', fil: 'Anong grade ka?', taglish: 'Anong grade ka?' },
  'onboarding.gradeLabel': { en: 'Grade {grade}', fil: 'Grade {grade}', taglish: 'Grade {grade}' },
  'onboarding.name': { en: 'What is your name?', fil: 'Anong pangalan mo?', taglish: 'Anong pangalan mo?' },
  'onboarding.namePlaceholder': { en: 'Your name', fil: 'Pangalan mo', taglish: 'Name mo' },
  'onboarding.next': { en: 'Next', fil: 'Sunod', taglish: 'Sunod' },
  'onboarding.greeting': {
    en: 'Hello, {name}! I am Teacher Gabay, your math guide.',
    fil: 'Kumusta, {name}! Ako si Teacher Gabay, ang iyong gabay sa Math.',
    taglish: 'Kumusta, {name}! Ako si Teacher Gabay, ang iyong math guide.',
  },
  'onboarding.masteryTitle': { en: 'Grow your Mastery', fil: 'Palakihin ang Mastery', taglish: 'Grow your Mastery' },
  'onboarding.mastery': {
    en: 'As you answer correctly, your Mastery will grow. Let us try!',
    fil: 'Habang sumasagot ka nang tama, lalaki ang iyong Mastery. Subukan natin!',
    taglish: 'Habang sumasagot ka nang tama, lalaki ang iyong Mastery. Subukan natin!',
  },
  'onboarding.start': { en: 'Let’s start!', fil: 'Magsimula!', taglish: 'Magsimula!' },
  'gradePicker.title': { en: 'Change grade', fil: 'Baguhin ang Grade', taglish: 'Baguhin ang Grade' },
  'gradePicker.confirm': {
    en: 'Your progress for this grade will be cleared. Continue?',
    fil: 'Mabubura ang iyong progress. Sige ba?',
    taglish: 'Mabubura ang iyong progress. Sige ba?',
  },

  // ---- nav tabs ----
  'nav.lessons': { en: 'Lessons', fil: 'Aralin', taglish: 'Lessons' },
  'nav.practice': { en: 'Practice', fil: 'Pagsasanay', taglish: 'Practice' },
  'nav.games': { en: 'Games', fil: 'Laro', taglish: 'Games' },
  'nav.profile': { en: 'Profile', fil: 'Profile', taglish: 'Profile' },

  // ---- Home ----
  'home.hallwayTag': { en: 'Classroom Hallway', fil: 'Hallway ng Silid-Aralan', taglish: 'Hallway ng Silid-Aralan' },
  'home.greeting': { en: 'Hello, Ka-Gabay!', fil: 'Kumusta, Ka-Gabay!', taglish: 'Kumusta, Ka-Gabay!' },
  'home.greetingName': { en: 'Hello, {name}!', fil: 'Kumusta, {name}!', taglish: 'Kumusta, {name}!' },
  'home.grade': { en: 'Grade {grade}', fil: 'Grade {grade}', taglish: 'Grade {grade}' },
  'home.subtitle': { en: 'Where shall we go today?', fil: 'Saan tayo pupunta ngayon?', taglish: 'Saan tayo pupunta ngayon?' },
  'home.open': { en: 'OPEN', fil: 'BUKAS', taglish: 'OPEN' },
  'home.lessons.title': { en: 'Lessons', fil: 'Mga Aralin', taglish: 'Mga Aralin' },
  'home.lessons.status': { en: 'New lesson', fil: 'Bagong aralin', taglish: 'Bagong aralin' },
  'home.lessons.cta': { en: 'Open', fil: 'Buksan', taglish: 'Buksan' },
  'home.classroom.title': { en: 'Teacher Gabay', fil: 'Teacher Gabay', taglish: 'Teacher Gabay' },
  'home.classroom.status': { en: 'AI tutor', fil: 'AI tutor', taglish: 'AI tutor' },
  'home.classroom.cta': { en: 'Enter', fil: 'Pasukin', taglish: 'Pasukin' },
  'home.games.title': { en: 'Mini Games', fil: 'Mga Laro', taglish: 'Mini Games' },
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
  'start.browseSubGrade': {
    en: 'Find all available Grade {grade} lessons.',
    fil: 'Hanapin ang lahat ng aralin para sa Grade {grade}.',
    taglish: 'Hanapin ang lahat ng Grade {grade} lessons.',
  },
  'start.viewList': { en: 'View the list', fil: 'Tingnan ang listahan', taglish: 'Tingnan ang listahan' },

  // ---- Topic Picker ----
  'topics.heading': { en: 'What shall we study today?', fil: 'Anong aaralin natin ngayon?', taglish: 'Anong aaralin natin ngayon?' },
  'topics.sub': { en: 'Pick a topic and start practising.', fil: 'Pumili ng topic at magsimula ng practice.', taglish: 'Pumili ng topic at magsimula ng practice.' },
  'topics.all': { en: 'All', fil: 'Lahat', taglish: 'Lahat' },
  'topics.search': { en: 'Search topics', fil: 'Maghanap ng aralin', taglish: 'Search ng topic' },
  'topics.noResults': { en: 'No results found.', fil: 'Walang nahanap.', taglish: 'Walang nahanap.' },
  'topics.lessonCount': { en: '{count} lessons', fil: '{count} aralin', taglish: '{count} lessons' },
  'topics.completedCount': { en: '{count} completed', fil: '{count} natapos', taglish: '{count} completed' },
  'topics.showLessons': { en: 'Show', fil: 'Ipakita', taglish: 'Show' },
  'topics.hideLessons': { en: 'Hide', fil: 'Itago', taglish: 'Hide' },
  'topics.practiceHeading': { en: 'Due for review', fil: 'Dapat balikan', taglish: 'Due for review' },
  'topics.practiceSub': { en: 'Strengthen topics that need another look.', fil: 'Balikan ang mga araling kailangan pa ng practice.', taglish: 'Balikan ang topics na kailangan pa ng practice.' },
  'topics.nothingDue': {
    en: 'Great! Nothing is due for review. Try a new lesson!',
    fil: 'Magaling! Wala pang dapat pag-aralan. Subukan ang bagong aralin!',
    taglish: 'Magaling! Wala pang dapat pag-aralan. Subukan ang bagong aralin!',
  },
  'topics.browseNew': { en: 'Browse new lessons', fil: 'Tingnan ang bagong aralin', taglish: 'Browse new lessons' },
  'difficulty.madali': { en: 'Easy', fil: 'Madali', taglish: 'Madali' },
  'difficulty.katamtaman': { en: 'Medium', fil: 'Katamtaman', taglish: 'Katamtaman' },
  'difficulty.mahirap': { en: 'Hard', fil: 'Mahirap', taglish: 'Mahirap' },
  'domain.Number and Algebra': { en: 'Number & Algebra', fil: 'Number at Algebra', taglish: 'Number & Algebra' },
  'domain.Measurement and Geometry': { en: 'Measurement & Geometry', fil: 'Sukat at Geometry', taglish: 'Measurement & Geometry' },
  'domain.Data and Probability': { en: 'Data & Probability', fil: 'Data at Probability', taglish: 'Data & Probability' },
  'domain.Statistics and Probability': { en: 'Statistics & Probability', fil: 'Statistics at Probability', taglish: 'Statistics & Probability' },

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
  'brief.enter3d': { en: '3D Class', fil: '3D Klase', taglish: '3D Klase' },

  // ---- Classroom (2D) ----
  'class.tab.explain': { en: 'Explanation', fil: 'Paliwanag', taglish: 'Paliwanag' },
  'class.tab.example': { en: 'Example', fil: 'Halimbawa', taglish: 'Halimbawa' },
  'class.tab.practice': { en: 'Practice', fil: 'Pagsasanay', taglish: 'Pagsasanay' },
  'class.listenAgain': { en: 'Listen again', fil: 'Pakinggan ulit', taglish: 'Pakinggan ulit' },
  'class.play': { en: 'Resume', fil: 'Ituloy', taglish: 'Ituloy' },
  'class.pause': { en: 'Pause', fil: 'I-pause', taglish: 'I-pause' },
  'class.raiseHand': { en: 'Ask Teacher', fil: 'Itaas ang kamay', taglish: 'Itaas ang kamay' },
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
  'class.typeHere': { en: 'Type your answer here 👇', fil: 'Isulat ang sagot dito 👇', taglish: 'I-type ang sagot mo dito 👇' },
  'class.pickAnswer': { en: 'Tap your answer', fil: 'Pumili ng sagot', taglish: 'Pumili ng sagot' },
  'class.repeat': { en: 'Repeat', fil: 'Ulitin', taglish: 'Ulitin' },
  'class.source.nano': { en: 'On-device (offline)', fil: 'On-device (offline)', taglish: 'On-device (offline)' },
  'class.source.online': { en: 'Teacher Gabay (online)', fil: 'Teacher Gabay (online)', taglish: 'Teacher Gabay (online)' },
  'class.source.cached': { en: 'Cached explanation', fil: 'Naka-cache na paliwanag', taglish: 'Naka-cache na paliwanag' },
  'class.reviewMissed': { en: "Let's review what we missed:", fil: 'Balikan natin ang mga namali:', taglish: 'Balikan natin ang mga namali:' },
  'class.steps': { en: 'Solve step by step', fil: 'Sagutan nang hakbang-hakbang', taglish: 'Solve step by step' },
  'class.stepCounter': { en: 'Step {step} / {total}', fil: 'Hakbang {step} / {total}', taglish: 'Hakbang {step} / {total}' },
  'classroom.tryAgain': {
    en: 'Not quite — give it another shot!',
    fil: 'Hindi pa — subukan ulit!',
    taglish: 'Hindi pa tama — try mo ulit!',
  },
  'classroom.correctOverlay': { en: 'Correct! 🌟', fil: 'Tama! 🌟', taglish: 'Tama! 🌟' },
  'classroom.retry': { en: 'Try again', fil: 'Subukan ulit', taglish: 'Subukan ulit' },
  'classroom.readSolution': { en: 'Read Nova’s explanation…', fil: 'Basahin ang paliwanag ni Nova…', taglish: 'Basahin ang explanation ni Nova…' },
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
  'profile.learner': { en: 'Learner', fil: 'Mag-aaral', taglish: 'Learner' },
  'profile.overall': { en: 'Overall mastery', fil: 'Kabuuang mastery', taglish: 'Overall mastery' },
  'profile.streak': { en: '{count} days in a row', fil: '{count} araw na sunod-sunod', taglish: '{count} araw na sunod-sunod' },
  'profile.changeGrade': { en: 'Change Grade', fil: 'Baguhin ang Grade', taglish: 'Baguhin ang Grade' },
  'achievement.first': { en: 'First Step', fil: 'Unang Hakbang', taglish: 'Unang Hakbang' },
  'achievement.games': { en: 'Game On', fil: 'Laban Mode', taglish: 'Laban Mode' },
  'achievement.streak': { en: 'On a Roll', fil: 'Tuloy-Tuloy', taglish: 'Tuloy-Tuloy' },

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
  'games.accuracy': { en: 'Accuracy', fil: 'Accuracy', taglish: 'Accuracy' },
  'games.coins': { en: 'Coins', fil: 'Coins', taglish: 'Coins' },
  'games.customer': { en: 'Customer', fil: 'Suki', taglish: 'Customer' },
  'games.pay': { en: 'Pay', fil: 'Bayaran', taglish: 'Bayaran' },
  'games.playAgain': { en: 'Play again', fil: 'Laruin ulit', taglish: 'Laruin ulit' },

  // ---- Games hub (pick a game) ----
  'games.pick': { en: 'Pick a game', fil: 'Pumili ng laro', taglish: 'Pumili ng laro' },
  'games.pickSub': {
    en: 'Each game practices a different part of the curriculum.',
    fil: 'Bawat laro ay para sa ibang bahagi ng kurikulum.',
    taglish: 'Bawat game ay para sa ibang bahagi ng curriculum.',
  },
  'games.chooseAnother': { en: 'Choose another game', fil: 'Pumili ng ibang laro', taglish: 'Pumili ng ibang game' },
  'games.lessonCount': { en: '{count} lessons', fil: '{count} aralin', taglish: '{count} lessons' },
  'games.lessonsTitle': { en: 'Lessons in this game', fil: 'Mga aralin sa larong ito', taglish: 'Lessons sa game na ito' },
  'games.lessonsSub': { en: '{count} focused topics from your grade level.', fil: '{count} nakatuong paksa para sa iyong baitang.', taglish: '{count} focused topics para sa grade level mo.' },
  'games.unavailable.title': { en: 'This game is not ready yet.', fil: 'Hindi pa handa ang larong ito.', taglish: 'Hindi pa ready ang game na ito.' },
  'games.unavailable.body': { en: 'Try again, or choose another game. Unrelated lessons will never be substituted.', fil: 'Subukan ulit o pumili ng ibang laro. Hindi ito papalitan ng ibang aralin.', taglish: 'Try again or choose another game. Hindi ito papalitan ng unrelated lessons.' },
  'games.summary.perfect': { en: 'Perfect run. You cleared every question.', fil: 'Perfect run. Nasagot mo lahat nang tama.', taglish: 'Perfect run. Nasagot mo lahat nang tama.' },
  'games.summary.great': { en: 'Strong run. You are getting faster.', fil: 'Magaling. Mas mabilis ka na.', taglish: 'Strong run. Mas mabilis ka na.' },
  'games.summary.practice': { en: 'Good try. Review the missed items below.', fil: 'Good try. Balikan ang mga namali sa baba.', taglish: 'Good try. Balikan ang mga namali sa baba.' },
  'games.summaryPracticed': { en: 'You practiced: {game}', fil: 'Pinractice mo: {game}', taglish: 'Pinractice mo: {game}' },
  'games.badge.number': { en: 'Number & Algebra', fil: 'Number & Algebra', taglish: 'Number & Algebra' },
  'games.badge.geometry': { en: 'Geometry', fil: 'Geometry', taglish: 'Geometry' },
  'games.badge.data': { en: 'Data', fil: 'Data', taglish: 'Data' },
  'games.badge.percent': { en: 'Percent', fil: 'Percent', taglish: 'Percent' },
  'games.badge.ratio': { en: 'Ratio', fil: 'Ratio', taglish: 'Ratio' },
  'games.badge.area': { en: 'Area', fil: 'Area', taglish: 'Area' },
  'games.badge.perimeter': { en: 'Perimeter', fil: 'Perimeter', taglish: 'Perimeter' },
  'games.badge.angles': { en: 'Angles', fil: 'Angles', taglish: 'Angles' },
  'games.badge.volume': { en: 'Volume', fil: 'Volume', taglish: 'Volume' },
  'games.badge.stats': { en: 'Mean/Median/Mode', fil: 'Mean/Median/Mode', taglish: 'Mean/Median/Mode' },
  'games.badge.probability': { en: 'Probability', fil: 'Probability', taglish: 'Probability' },
  'games.badge.counting': { en: 'Counting', fil: 'Pagbilang', taglish: 'Counting' },
  'games.badge.ordering': { en: 'Ordering', fil: 'Pag-aayos', taglish: 'Ordering' },
  'games.badge.placeValue': { en: 'Place Value', fil: 'Place Value', taglish: 'Place Value' },
  'games.badge.addition': { en: 'Addition', fil: 'Addition', taglish: 'Addition' },
  'games.badge.subtraction': { en: 'Subtraction', fil: 'Subtraction', taglish: 'Subtraction' },
  'games.badge.money': { en: 'Money', fil: 'Pera', taglish: 'Money' },
  'games.badge.shapes': { en: 'Shapes', fil: 'Mga Hugis', taglish: 'Shapes' },
  'games.badge.measurement': { en: 'Measurement', fil: 'Pagsukat', taglish: 'Measurement' },
  'games.badge.time': { en: 'Time', fil: 'Oras', taglish: 'Time' },
  'games.badge.patterns': { en: 'Patterns', fil: 'Mga Pattern', taglish: 'Patterns' },
  'games.badge.fractions': { en: 'Fractions', fil: 'Fractions', taglish: 'Fractions' },
  'games.badge.multiplication': { en: 'Multiplication', fil: 'Multiplication', taglish: 'Multiplication' },
  'games.badge.division': { en: 'Division', fil: 'Division', taglish: 'Division' },
  'games.badge.rounding': { en: 'Rounding', fil: 'Rounding', taglish: 'Rounding' },
  'games.badge.operations': { en: 'Operations', fil: 'Operations', taglish: 'Operations' },
  'games.badge.graphs': { en: 'Graphs', fil: 'Mga Graph', taglish: 'Graphs' },
  'games.badge.decimals': { en: 'Decimals', fil: 'Decimals', taglish: 'Decimals' },
  'games.badge.factors': { en: 'Factors', fil: 'Factors', taglish: 'Factors' },
  'games.badge.conversion': { en: 'Conversion', fil: 'Conversion', taglish: 'Conversion' },
  'games.badge.world': { en: 'World Time', fil: 'Oras sa Mundo', taglish: 'World Time' },
  'games.badge.transformation': { en: 'Transformations', fil: 'Transformations', taglish: 'Transformations' },

  ...GRADE_GAME_STRINGS,

  // Store (Number & Algebra)
  'games.store.name': { en: 'Store Game', fil: 'Tindahan Game', taglish: 'Tindahan Game' },
  'games.store.tagline': {
    en: 'Compute totals, discounts, ratios, and percent while you sell.',
    fil: 'Mag-compute ng total, diskwento, ratio, at percent habang nagtitinda.',
    taglish: 'Mag-compute ng total, discount, ratio, at percent habang nagtitinda.',
  },
  'games.store.actor': { en: 'Customer', fil: 'Suki', taglish: 'Customer' },
  'games.store.action': { en: 'Pay', fil: 'Bayaran', taglish: 'Bayaran' },
  'games.store.start': { en: 'Open the Store ({n} questions)', fil: 'Buksan ang Tindahan ({n} tanong)', taglish: 'Buksan ang Tindahan ({n} tanong)' },
  'games.store.closed': { en: 'Store closed!', fil: 'Tindahan sarado!', taglish: 'Tindahan sarado!' },

  // Garden (Measurement & Geometry — plane figures, area, perimeter)
  'games.garden.name': { en: 'Garden Game', fil: 'Hardin Game', taglish: 'Hardin Game' },
  'games.garden.tagline': {
    en: 'Measure plots, fences, and flower beds with area and perimeter.',
    fil: 'Sukatin ang taniman, bakod, at halamanan gamit ang area at perimeter.',
    taglish: 'Sukatin ang plots, bakod, at flower beds gamit ang area at perimeter.',
  },
  'games.garden.actor': { en: 'Gardener', fil: 'Hardinero', taglish: 'Hardinero' },
  'games.garden.action': { en: 'Plant', fil: 'Itanim', taglish: 'Itanim' },
  'games.garden.start': { en: 'Start the Garden ({n} questions)', fil: 'Simulan ang Hardin ({n} tanong)', taglish: 'Simulan ang Hardin ({n} tanong)' },
  'games.garden.closed': { en: 'Garden grown!', fil: 'Lumago ang hardin!', taglish: 'Lumago ang hardin!' },

  // House Builder (Measurement & Geometry — angles, volume, capacity)
  'games.house.name': { en: 'House Builder', fil: 'Bahay Builder', taglish: 'Bahay Builder' },
  'games.house.tagline': {
    en: 'Build rooms using angles, volume, and capacity.',
    fil: 'Magtayo ng silid gamit ang anggulo, volume, at kapasidad.',
    taglish: 'Mag-build ng rooms gamit ang angles, volume, at capacity.',
  },
  'games.house.actor': { en: 'Client', fil: 'Kliyente', taglish: 'Client' },
  'games.house.action': { en: 'Build', fil: 'Itayo', taglish: 'Itayo' },
  'games.house.start': { en: 'Start Building ({n} questions)', fil: 'Simulan ang Pagtatayo ({n} tanong)', taglish: 'Simulan ang Build ({n} tanong)' },
  'games.house.closed': { en: 'House finished!', fil: 'Tapos na ang bahay!', taglish: 'Tapos na ang bahay!' },

  // Fiesta Booth (Data & Probability — graphs, mean/median/mode, chance)
  'games.fiesta.name': { en: 'Fiesta Booth', fil: 'Fiesta Booth', taglish: 'Fiesta Booth' },
  'games.fiesta.tagline': {
    en: 'Read graphs, find mean, median, and mode, and guess the chances.',
    fil: 'Basahin ang grap, hanapin ang mean, median, at mode, at hulaan ang tsansa.',
    taglish: 'Basahin ang graphs, hanapin ang mean, median, mode, at hulaan ang chance.',
  },
  'games.fiesta.actor': { en: 'Visitor', fil: 'Bisita', taglish: 'Bisita' },
  'games.fiesta.action': { en: 'Answer', fil: 'Sagutin', taglish: 'Sagutin' },
  'games.fiesta.start': { en: 'Open the Fiesta ({n} questions)', fil: 'Buksan ang Fiesta ({n} tanong)', taglish: 'Buksan ang Fiesta ({n} tanong)' },
  'games.fiesta.closed': { en: 'Fiesta done!', fil: 'Tapos ang fiesta!', taglish: 'Tapos ang fiesta!' },

  // ---- 3D Classroom HUD ----
  '3d.preparing': { en: 'Preparing the 3D class...', fil: 'Inihahanda ang 3D klase...', taglish: 'Inihahanda ang 3D klase...' },
  '3d.unavailable.title': { en: '3D class is not available on this device.', fil: 'Hindi available ang 3D klase sa device na ito.', taglish: 'Hindi available ang 3D class sa device na ito.' },
  '3d.unavailable.body': { en: 'You can continue with the same questions in the 2D classroom.', fil: 'Maaari mong ipagpatuloy ang parehong mga tanong sa 2D na klase.', taglish: 'Pwede mong ituloy ang parehong questions sa 2D classroom.' },
  '3d.unavailable.action': { en: 'Continue in 2D →', fil: 'Ituloy sa 2D →', taglish: 'Ituloy sa 2D →' },
  '3d.theme': { en: 'Theme', fil: 'Tema', taglish: 'Tema' },
  '3d.changeRoom': { en: 'Change the room', fil: 'Palitan ang klase', taglish: 'Palitan ang klase' },
  '3d.answerBoard': { en: 'Answer', fil: 'Sagutin', taglish: 'Sagutin' },
  '3d.hintAtBoard': { en: 'Tap Answer or press E / F', fil: 'I-tap ang Sagutin o pindutin ang E / F', taglish: 'Tap Sagutin o pindutin ang E / F' },
  '3d.firstAnswerHint': { en: 'Go near the board to answer.', fil: 'Lumapit sa pisara para sumagot.', taglish: 'Lumapit sa pisara para sumagot.' },
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

  // ---- 3D first-entry coachmark ----
  '3d.intro.title': { en: 'How to answer', fil: 'Paano sumagot', taglish: 'Paano sumagot' },
  '3d.intro.s1': { en: 'Move to the board.', fil: 'Lumapit sa pisara.', taglish: 'Galaw papunta sa pisara.' },
  '3d.intro.s2': { en: 'Tap the Answer button.', fil: 'I-tap ang Sagutin.', taglish: 'I-tap ang Sagutin.' },
  '3d.intro.s3': { en: 'Type your answer, then send.', fil: 'Isulat ang sagot, tapos ipasa.', taglish: 'I-type ang sagot mo, tapos send.' },
  '3d.intro.go': { en: "Got it!", fil: 'Sige!', taglish: 'Sige!' },
  '3d.coach.move': {
    en: 'Use WASD or the arrow keys to move.',
    fil: 'Gamitin ang WASD o arrow keys para gumalaw.',
    taglish: 'Gamitin ang WASD o arrow keys para gumalaw.',
  },
  '3d.coach.board': {
    en: 'Walk closer to the board to see the lesson.',
    fil: 'Lumapit sa pisara para makita ang aralin.',
    taglish: 'Lumapit sa pisara para makita ang aralin.',
  },
  '3d.joystick': { en: 'Movement joystick', fil: 'Joystick para gumalaw', taglish: 'Joystick para gumalaw' },

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
