import test from 'node:test'
import assert from 'node:assert/strict'
import grade1 from '../src/curriculum/grade1.json' with { type: 'json' }
import grade2 from '../src/curriculum/grade2.json' with { type: 'json' }
import grade3 from '../src/curriculum/grade3.json' with { type: 'json' }
import grade4 from '../src/curriculum/grade4.json' with { type: 'json' }
import grade5 from '../src/curriculum/grade5.json' with { type: 'json' }
import grade6 from '../src/curriculum/grade6.json' with { type: 'json' }
import { GAME_CATALOG, getGamesForGrade, lessonTitlesForGame, validateGameCatalog } from '../src/lib/game-catalog.js'
import { STRINGS } from '../src/lib/i18n.js'

const curriculumByGrade = { 1: grade1, 2: grade2, 3: grade3, 4: grade4, 5: grade5, 6: grade6 }
const REQUIRED_COPY = ['name', 'tagline', 'actor', 'action', 'start', 'closed']
const LANGUAGES = ['en', 'fil', 'taglish']

test('game catalog covers every grade competency exactly once with playable pools', () => {
  assert.deepEqual(validateGameCatalog(GAME_CATALOG, curriculumByGrade), [])
  for (let grade = 1; grade <= 6; grade += 1) {
    const games = getGamesForGrade(grade)
    assert.equal(games.length, 4)
    assert.equal(new Set(games.flatMap((game) => game.refs)).size, curriculumByGrade[grade].length)
  }
})

test('invalid grades use the safe Grade 6 catalog', () => {
  assert.equal(getGamesForGrade('not-a-grade'), GAME_CATALOG[6])
  assert.equal(getGamesForGrade(7), GAME_CATALOG[6])
})

test('catalog validation reports unknown, duplicate, missing, and undersized assignments', () => {
  const broken = structuredClone(GAME_CATALOG)
  broken[1][0].refs = ['1NA-Ib-1', '9NA-Ia-1']
  broken[1][1].refs.push('1NA-Ib-1')
  const errors = validateGameCatalog(broken, curriculumByGrade)
  assert.ok(errors.some((error) => error.includes('unknown or cross-grade ref 9NA-Ia-1')))
  assert.ok(errors.some((error) => error.includes('assigned to both')))
  assert.ok(errors.some((error) => error.includes('is not assigned to a game')))
  assert.ok(errors.some((error) => error.includes('bundled questions')))
})

test('every game and badge has complete learner-facing translations', () => {
  for (const games of Object.values(GAME_CATALOG)) {
    for (const game of games) {
      for (const suffix of REQUIRED_COPY) {
        const value = STRINGS[`games.${game.key}.${suffix}`]
        assert.ok(value, `${game.key}.${suffix}`)
        for (const language of LANGUAGES) assert.ok(value[language]?.trim(), `${game.key}.${suffix}.${language}`)
      }
      for (const badge of game.badgeKeys) {
        const value = STRINGS[`games.badge.${badge}`]
        assert.ok(value, `games.badge.${badge}`)
        for (const language of LANGUAGES) assert.ok(value[language]?.trim(), `games.badge.${badge}.${language}`)
      }
    }
  }
})

test('each game exposes deduplicated learner-facing lesson titles', () => {
  for (let grade = 1; grade <= 6; grade += 1) {
    for (const game of getGamesForGrade(grade)) {
      const titles = lessonTitlesForGame(game, curriculumByGrade[grade])
      assert.ok(titles.length > 0, game.id)
      assert.equal(titles.length, new Set(titles).size, game.id)
      assert.ok(titles.every((title) => title.split(/\s+/).length <= 3), game.id)
    }
  }
})
