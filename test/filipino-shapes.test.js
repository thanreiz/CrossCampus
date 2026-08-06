import assert from 'node:assert/strict'
import test from 'node:test'

import { getContentByRef } from '../src/lib/content-catalog.js'
import { localize, localizeChoice } from '../src/lib/i18n.js'

test('Filipino shape choices are translated without changing stored answers', () => {
  assert.equal(localizeChoice('square', 'fil'), 'parisukat')
  assert.equal(localizeChoice('triangle', 'fil'), 'tatsulok')
  assert.equal(localizeChoice('rectangle', 'fil'), 'parihaba')
  assert.equal(localizeChoice('circle', 'fil'), 'bilog')
  assert.equal(localizeChoice('True', 'fil'), 'Tama')
  assert.equal(localizeChoice('3 sides and 3 corners', 'fil'), '3 gilid at 3 sulok')
  assert.equal(localizeChoice('two triangles', 'fil'), 'dalawang tatsulok')
  assert.equal(localizeChoice('4', 'fil'), '4')
})

test('Grade 1 shape lessons use curated Filipino teaching and practice copy', () => {
  for (const ref of ['1MG-Ia-1', '1MG-Ia-2', '1MG-Ia-3']) {
    const competency = getContentByRef(ref)
    assert.ok(competency, `${ref} is missing`)
    assert.match(localize(competency.explanation, 'fil'), /hugis/i)
    assert.match(localize(competency.worked_example_prompt, 'fil'), /alin|ano/i)

    for (const item of competency.items) {
      const question = localize(item.q, 'fil')
      const solution = localize(item.solution, 'fil')
      assert.notEqual(question, localize(item.q, 'en'), `${ref} has an untranslated question`)
      assert.notEqual(solution, localize(item.solution, 'en'), `${ref} has an untranslated solution`)
    }
  }
})
