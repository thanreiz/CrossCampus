import test from 'node:test'
import assert from 'node:assert/strict'
import { getContentByRef, loadContentByGrade } from '../src/lib/content.js'

test('client curriculum loader fetches and caches one grade at a time', async () => {
  assert.equal(getContentByRef('1MG-Ia-1'), null)
  const grade1 = await loadContentByGrade(1)
  assert.equal(grade1.length, 47)
  assert.equal(getContentByRef('1MG-Ia-1')?.grade, 1)
  assert.strictEqual(await loadContentByGrade(1), grade1)
})
