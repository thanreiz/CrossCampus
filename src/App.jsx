import { useEffect, useState, lazy, Suspense } from 'react'
import content from './content.json'
import { loadMastery, loadDue, recordAnswer, pickNext } from './lib/mastery.js'
import { initVoices } from './lib/speech.js'
import Splash from './screens/Splash.jsx'
import Home from './screens/Home.jsx'
import StartChoice from './screens/StartChoice.jsx'
import TopicPicker from './screens/TopicPicker.jsx'
import LessonBrief from './screens/LessonBrief.jsx'
import Classroom from './screens/Classroom.jsx'
import Progress from './screens/Progress.jsx'
import Games from './screens/Games.jsx'
import BottomNav from './ui/BottomNav.jsx'

// 3D classroom pulls in three.js - load it on demand (chunk still precached for offline).
const Classroom3D = lazy(() => import('./screens/Classroom3D.jsx'))

// Screens: splash -> home -> start -> topics -> brief -> classroom (+ progress)
export default function App() {
  const [screen, setScreen] = useState('splash')
  const [mastery, setMastery] = useState({})
  const [due, setDue] = useState({})
  const [active, setActive] = useState(null) // selected competency
  const [current, setCurrent] = useState(null) // last-opened lesson (stable across nav)
  const [online, setOnline] = useState(navigator.onLine)

  // Load persisted mastery (IndexedDB) + warm up TTS voices.
  useEffect(() => {
    initVoices()
    ;(async () => {
      setMastery(await loadMastery())
      setDue(await loadDue())
    })()
  }, [])

  // Gate online-only features (voice-in mic) on connectivity.
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

  const next = pickNext(content, mastery, due)

  // Bottom-nav target: Lessons / Practice / Games / Profile -> screens.
  // Lessons -> Start Choice (Tuloy/Tingnan); Practice -> Topic Picker.
  function navTo(key) {
    if (key === 'lessons') setScreen('start')
    else if (key === 'practice') setScreen('topics')
    else if (key === 'games') setScreen('games')
    else if (key === 'profile') setScreen('progress')
  }
  // Wrap a main screen with the persistent bottom nav.
  function withNav(activeKey, node) {
    return (
      <>
        {node}
        <BottomNav active={activeKey} onNav={navTo} />
      </>
    )
  }

  function goBrief(competency) {
    setActive(competency)
    setCurrent(competency) // remember as the current lesson (Tuloy stays stable)
    setScreen('brief')
  }

  async function handleAnswered(ref, correct) {
    await recordAnswer(ref, correct)
    setMastery(await loadMastery())
    setDue(await loadDue())
  }

  switch (screen) {
    case 'splash':
      return <Splash onStart={() => setScreen('home')} />

    case 'home':
      return withNav(
        'lessons',
        <Home
          online={online}
          onPick={(door) => {
            if (door === 'lessons') setScreen('start')
            else if (door === 'classroom') setScreen('start')
            else if (door === 'games') setScreen('games')
          }}
        />,
      )

    case 'start':
      return withNav(
        'lessons',
        <StartChoice
          next={current ?? next}
          mastery={mastery}
          onAuto={() => setScreen('topics')}
          onBrowse={() => setScreen('topics')}
          onBack={() => setScreen('home')}
        />,
      )

    case 'topics':
      return withNav(
        'practice',
        <TopicPicker
          competencies={content}
          mastery={mastery}
          onPick={goBrief}
          onBack={() => setScreen('start')}
        />,
      )

    case 'brief':
      return (
        <LessonBrief
          competency={active}
          score={mastery[active.ref] ?? 0.5}
          onEnter={() => setScreen('classroom')}
          onEnter3D={() => setScreen('classroom3d')}
          onBack={() => setScreen('topics')}
        />
      )

    case 'classroom':
      return (
        <Classroom
          competency={active}
          score={mastery[active.ref] ?? 0.5}
          online={online}
          onAnswered={handleAnswered}
          onExit={() => setScreen('progress')}
        />
      )

    case 'classroom3d':
      return (
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#27433b] font-display text-xl text-cream">
              Inihahanda ang 3D klase...
            </div>
          }
        >
          <Classroom3D
            competency={active}
            score={mastery[active.ref] ?? 0.5}
            online={online}
            onAnswered={handleAnswered}
            onExit={() => setScreen('progress')}
          />
        </Suspense>
      )

    case 'progress':
      return withNav(
        'profile',
        <Progress
          competencies={content}
          mastery={mastery}
          next={next}
          onPick={goBrief}
          onBack={() => setScreen('home')}
        />,
      )

    case 'games':
      return withNav('games', <Games competencies={content} mastery={mastery} onAnswered={handleAnswered} />)

    default:
      return <Home onPick={() => setScreen('start')} />
  }
}


