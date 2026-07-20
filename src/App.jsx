import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { get } from 'idb-keyval'
import { loadContentByGrade } from './lib/content.js'
import {
  loadDueForGrade,
  loadMasteryForGrade,
  migrateMastery,
  pickNext,
  recordAnswer,
} from './lib/mastery.js'
import { initVoices } from './lib/speech.js'
import { loadLang, saveLang, DEFAULT_LANG } from './lib/lang.js'
import { t } from './lib/i18n.js'
import Splash from './screens/Splash.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Home from './screens/Home.jsx'
import StartChoice from './screens/StartChoice.jsx'
import TopicPicker from './screens/TopicPicker.jsx'
import LessonBrief from './screens/LessonBrief.jsx'
import Classroom from './screens/Classroom.jsx'
import Progress from './screens/Progress.jsx'
import GradePicker from './screens/GradePicker.jsx'
import Games from './screens/Games.jsx'
import Generating from './screens/Generating.jsx'
import BottomNav from './ui/BottomNav.jsx'
import SoundToggle from './ui/SoundToggle.jsx'
import { loadSoundPrefs, pauseBgm, primeAudio, resumeBgm, startBgm } from './lib/sound.js'
import { prepareQuestionSession } from './lib/question-session.js'

const Classroom3D = lazy(() => import('./screens/Classroom3D.jsx'))

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [mastery, setMastery] = useState({})
  const [due, setDue] = useState({})
  const [grade, setGrade] = useState(6)
  const [studentName, setStudentName] = useState('')
  const [active, setActive] = useState(null)
  const [current, setCurrent] = useState(null)
  const [topicMode, setTopicMode] = useState('browse')
  const [online, setOnline] = useState(navigator.onLine)
  const [lang, setLangState] = useState(DEFAULT_LANG)
  const [questionSession, setQuestionSession] = useState(null)
  const [content, setContent] = useState([])
  const classroomStartRef = useRef(false)
  const next = pickNext(content, mastery, due)

  async function refreshLearning(nextGrade = grade) {
    const [nextMastery, nextDue] = await Promise.all([
      loadMasteryForGrade(nextGrade),
      loadDueForGrade(nextGrade),
    ])
    setMastery(nextMastery)
    setDue(nextDue)
  }

  useEffect(() => {
    initVoices()
    ;(async () => {
      await migrateMastery()
      const [savedLang, savedGrade, savedName] = await Promise.all([
        loadLang(),
        get('gabay:selectedGrade'),
        get('gabay:studentName'),
      ])
      const initialGrade = Number(savedGrade) || 6
      setLangState(savedLang)
      setGrade(initialGrade)
      setStudentName(savedName ?? '')
      setContent(await loadContentByGrade(initialGrade))
      await refreshLearning(initialGrade)
    })()
    loadSoundPrefs()
  }, [])

  useEffect(() => {
    const onVis = () => (document.hidden ? pauseBgm() : resumeBgm())
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  function changeLang(nextLang) {
    setLangState(nextLang)
    saveLang(nextLang)
  }

  function navTo(key) {
    if (key === 'lessons') setScreen('start')
    else if (key === 'practice') {
      setTopicMode('practice')
      setScreen('topics')
    } else if (key === 'games') setScreen('games')
    else if (key === 'profile') setScreen('progress')
  }

  function withNav(activeKey, node) {
    return (
      <>
        {node}
        <SoundToggle />
        <BottomNav active={activeKey} onNav={navTo} lang={lang} />
      </>
    )
  }

  function goBrief(competency) {
    if (!competency) return
    setActive(competency)
    setCurrent(competency)
    setScreen('brief')
  }

  async function enterClassroom(kind) {
    if (!active || classroomStartRef.current) return
    classroomStartRef.current = true
    setScreen('generating')
    try {
      const session = await prepareQuestionSession({
        grade,
        mode: 'quiz',
        scope: { key: `lesson:${active.ref}`, refs: [active.ref] },
        count: 5,
        language: lang,
        mastery,
        connectivity: online,
        competencies: content,
      })
      setQuestionSession(session)
      setScreen(kind === '3d' ? 'classroom3d' : 'classroom')
    } catch {
      setScreen('brief')
    } finally {
      classroomStartRef.current = false
    }
  }

  async function handleAnswered(ref, correct) {
    await recordAnswer(ref, correct, grade)
    await refreshLearning(grade)
  }

  async function handleGradeChanged(nextGrade) {
    setGrade(nextGrade)
    setActive(null)
    setCurrent(null)
    const [nextContent] = await Promise.all([loadContentByGrade(nextGrade), refreshLearning(nextGrade)])
    setContent(nextContent)
    setScreen('home')
  }

  switch (screen) {
    case 'splash':
      return (
        <Splash
          lang={lang}
          onStart={async () => {
            primeAudio()
            startBgm()
            const name = await get('gabay:studentName')
            setScreen(name ? 'home' : 'onboarding')
          }}
        />
      )

    case 'onboarding':
      return (
        <Onboarding
          lang={lang}
          onDone={async ({ name, grade: selectedGrade }) => {
            setStudentName(name)
            setGrade(selectedGrade)
            const [nextContent] = await Promise.all([loadContentByGrade(selectedGrade), refreshLearning(selectedGrade)])
            setContent(nextContent)
            setScreen('home')
          }}
        />
      )

    case 'home':
      return withNav('lessons', (
        <Home
          online={online}
          lang={lang}
          onLang={changeLang}
          studentName={studentName}
          grade={grade}
          onPick={(door) => setScreen(door === 'games' ? 'games' : 'start')}
        />
      ))

    case 'start':
      return withNav('lessons', (
        <StartChoice
          online={online}
          lang={lang}
          next={current ?? next}
          mastery={mastery}
          grade={grade}
          onAuto={goBrief}
          onBrowse={() => {
            setTopicMode('browse')
            setScreen('topics')
          }}
          onBack={() => setScreen('home')}
        />
      ))

    case 'topics':
      return withNav(topicMode === 'practice' ? 'practice' : 'lessons', (
        <TopicPicker
          online={online}
          lang={lang}
          competencies={content}
          mastery={mastery}
          due={due}
          grade={grade}
          mode={topicMode}
          onBrowse={() => setTopicMode('browse')}
          onPick={goBrief}
          onBack={() => setScreen(topicMode === 'practice' ? 'home' : 'start')}
        />
      ))

    case 'brief':
      return withNav('practice', (
        <LessonBrief
          online={online}
          lang={lang}
          competency={active}
          score={mastery[active.ref] ?? 0}
          answered={Object.prototype.hasOwnProperty.call(mastery, active.ref)}
          onEnter={() => enterClassroom('2d')}
          onEnter3D={() => enterClassroom('3d')}
          onBack={() => setScreen('topics')}
        />
      ))

    case 'classroom':
      return (
        <Classroom
          competency={active}
          questions={questionSession?.questions}
          questionSource={questionSession?.source}
          fallback={questionSession?.fallback}
          score={mastery[active.ref] ?? 0}
          answered={Object.prototype.hasOwnProperty.call(mastery, active.ref)}
          online={online}
          lang={lang}
          onLang={changeLang}
          onAnswered={handleAnswered}
          onExit={() => setScreen('progress')}
        />
      )

    case 'classroom3d':
      return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#27433b] font-display text-xl text-cream">{t('3d.preparing', lang)}</div>}>
          <Classroom3D
            competency={active}
            questions={questionSession?.questions}
            questionSource={questionSession?.source}
            fallback={questionSession?.fallback}
            score={mastery[active.ref] ?? 0}
            online={online}
            lang={lang}
            onAnswered={handleAnswered}
            onExit={() => setScreen('progress')}
            onFallback2D={() => setScreen('classroom')}
          />
        </Suspense>
      )

    case 'generating':
      return <Generating lang={lang} />

    case 'progress':
      return withNav('profile', (
        <Progress
          online={online}
          lang={lang}
          competencies={content}
          mastery={mastery}
          grade={grade}
          studentName={studentName}
          next={next}
          onPick={goBrief}
          onChangeGrade={() => setScreen('gradePicker')}
        />
      ))

    case 'gradePicker':
      return <GradePicker currentGrade={grade} lang={lang} onDone={handleGradeChanged} onBack={() => setScreen('progress')} />

    case 'games':
      return withNav('games', (
        <Games online={online} grade={grade} competencies={content} mastery={mastery} lang={lang} onAnswered={handleAnswered} />
      ))

    default:
      return <Home online={online} lang={lang} studentName={studentName} grade={grade} onPick={() => setScreen('start')} />
  }
}
