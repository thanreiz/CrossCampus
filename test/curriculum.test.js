import test from 'node:test'
import assert from 'node:assert/strict'
import { getAllContent, getContentByGrade } from '../src/lib/content.js'

const EXPECTED = [47, 53, 51, 54, 49, 52]

test('all six MATATAG grade catalogs are complete and traceable', () => {
  const all = getAllContent()
  assert.equal(all.length, EXPECTED.reduce((sum, value) => sum + value, 0))
  assert.equal(new Set(all.map((entry) => entry.ref)).size, all.length)
  EXPECTED.forEach((count, index) => {
    const grade = index + 1
    const entries = getContentByGrade(grade)
    assert.equal(entries.length, count)
    for (const competency of entries) {
      assert.equal(competency.grade, grade)
      assert.equal(competency.source_trace.ref, competency.ref)
      assert.ok(competency.items.length >= 5, competency.ref)
      assert.ok(competency.items.every((item) => item.answer !== undefined && item.solution && item.source), competency.ref)
      assert.ok(competency.game_tags.length >= 1, competency.ref)
    }
  })
})
