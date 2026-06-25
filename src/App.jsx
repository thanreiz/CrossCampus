import { useEffect, useState } from 'react'
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

// Screens: splash -> home -> start -> topics -> brief -> classroom (+ progress)
export default function App() {
  const [screen, setScreen] = useState('splash')
  const [mastery, setMastery] = useState({})
  const [due, setDue] = useState({})
  const [active, setActive] = useState(null) // selected competency
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

  function goBrief(competency) {
    setActive(competency)
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
      return (
        <Home
          onPick={(door) => {
            if (door === 'lessons') setScreen('start')
            else if (door === 'classroom') setScreen('start')
            else if (door === 'progress') setScreen('progress')
          }}
        />
      )

    case 'start':
      return (
        <StartChoice
          next={next}
          mastery={mastery}
          onAuto={(c) => goBrief(c)}
          onBrowse={() => setScreen('topics')}
          onBack={() => setScreen('home')}
        />
      )

    case 'topics':
      return (
        <TopicPicker
          competencies={content}
          mastery={mastery}
          onPick={goBrief}
          onBack={() => setScreen('start')}
        />
      )

    case 'brief':
      return (
        <LessonBrief
          competency={active}
          onEnter={() => setScreen('classroom')}
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

    case 'progress':
      return (
        <Progress
          competencies={content}
          mastery={mastery}
          next={next}
          onPick={goBrief}
          onBack={() => setScreen('home')}
        />
      )

    default:
      return <Home onPick={() => setScreen('start')} />
  }
}
