import test from 'node:test'
import assert from 'node:assert/strict'
import { getAllContent, getContentByGrade } from '../src/lib/content.js'

const EXPECTED = [47, 53, 51, 54, 49, 52]
const SUPPORTED = new Set(['numeric', 'mcq', 'matching', 'true_false'])
const WEAK_OPTION = /alternative\s*\d|first category|second category|third category|answer choice|option\s*\d/i

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
      assert.ok(competency.source_trace.local_ref)
      assert.ok(competency.source_trace.quiz.endsWith('.md'))
      assert.ok(competency.items.length >= 3, competency.ref)
      assert.equal(new Set(competency.items.map((item) => JSON.stringify(item.q))).size, competency.items.length, competency.ref)
      assert.ok(competency.items.every((item) => item.answer !== undefined && item.solution && item.source?.path && SUPPORTED.has(item.type)), competency.ref)
      assert.ok(competency.items.every((item) => item.source.package === 'DepEd-MATATAG-Mathematics-Grades-1-6'), competency.ref)
      for (const item of competency.items.filter((question) => question.options)) {
        assert.equal(new Set(item.options).size, item.options.length, `${competency.ref} has duplicate options`)
        assert.ok(item.options.includes(item.answer), `${competency.ref} answer missing from options`)
        assert.ok(item.options.every((option) => !WEAK_OPTION.test(option)), `${competency.ref} has placeholder options`)
        if (item.type === 'mcq') assert.equal(item.options.length, 4, `${competency.ref} MCQ does not have four options`)
      }
      assert.ok(competency.game_tags.length >= 1, competency.ref)
    }
  })
})
