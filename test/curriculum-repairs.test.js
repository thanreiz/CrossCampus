import assert from 'node:assert/strict'
import test from 'node:test'

import { getContentByRef } from '../src/lib/content-catalog.js'

test('Grade 1 counting uses Filipino copy and related sequence choices', () => {
  const competency = getContentByRef('1NA-Ib-1')
  assert.equal(competency.example_visual, 'skipCounting')
  assert.equal(competency.worked_example_prompt.fil, 'Ipagpatuloy ang bilang: 28, 30, 32, __, __.')
  assert.equal(competency.worked_example_answer.fil, 'Ang nawawalang mga bilang ay 34 at 36.')

  for (const item of competency.items) {
    assert.equal(item.type, 'mcq')
    assert.equal(item.options.length, 4)
    assert.equal(new Set(item.options).size, 4)
    assert.ok(item.options.includes(item.answer))
    assert.match(item.q.fil, /Ipagpatuloy ang bilang:/)
    assert.notEqual(item.solution.en, item.solution.fil)
  }
})

test('building-shapes practice has visible diagrams and question-related choices', () => {
  const competency = getContentByRef('1MG-Ia-3')
  const allowedShapeWords = /square|triangle|rectangle|circle|shape|roof|body|1|2|3|4|True|False/i

  for (const item of competency.items) {
    assert.doesNotMatch(item.q.en, /diagram description/i)
    assert.ok(item.options?.includes(item.answer), `${item.answer} is missing from its choices`)
    assert.ok(item.options.every((option) => allowedShapeWords.test(option)), `unrelated choice: ${item.options.join(', ')}`)
  }
})

test('Grade 1 length lessons assess their own skill with coherent answer sets', () => {
  const refs = ['1MG-Ii-1', '1MG-Ij-1', '1MG-Ij-2']

  for (const ref of refs) {
    const competency = getContentByRef(ref)
    assert.ok(competency.example_visual)

    for (const item of competency.items) {
      assert.equal(item.type, 'mcq')
      assert.equal(item.options.length, 4)
      assert.equal(new Set(item.options).size, 4)
      assert.ok(item.options.includes(item.answer))
      assert.notEqual(item.q.en, item.q.fil)
      assert.notEqual(item.solution.en, item.solution.fil)
    }
  }

  assert.ok(getContentByRef('1MG-Ii-1').items.every((item) => /paper clips/i.test(item.q.en)))
  assert.ok(getContentByRef('1MG-Ij-1').items.every((item) => /Which statement is correct/i.test(item.q.en)))
  assert.ok(getContentByRef('1MG-Ij-2').items.every((item) => /total length/i.test(item.q.en)))
})
