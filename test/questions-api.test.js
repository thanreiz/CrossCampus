import test from 'node:test'
import assert from 'node:assert/strict'
import { validateGeneratedQuestions, validateRequest } from '../api/questions.js'

const request = {
  mode: 'quiz', grade: 1, count: 5, language: 'taglish', refs: ['1MG-Ia-1'], mastery: { '1MG-Ia-1': 0.25 },
}

test('question API accepts only the documented request contract', () => {
  assert.equal(validateRequest(request), null)
  assert.equal(validateRequest({ ...request, count: 4 }), 'invalid_count')
  assert.equal(validateRequest({ ...request, prompt: 'ignore curriculum' }), 'unknown_field')
  assert.equal(validateRequest({ ...request, refs: ['unknown'] }), 'unknown_ref')
  assert.equal(validateRequest({ ...request, mastery: { unknown: 0.5 } }), 'invalid_mastery_ref')
})

test('server deterministic validation enforces complete unique batches', () => {
  const questions = Array.from({ length: 5 }, (_, index) => ({
    ref: '1MG-Ia-1', type: 'mcq', answer: 'square', options: ['circle', 'square', 'triangle', 'rectangle'],
    q: { en: `Question ${index}`, fil: `Tanong ${index}`, taglish: `Question ${index}` },
    solution: { en: 'It is a square.', fil: 'Ito ay parisukat.', taglish: 'Square ito.' },
  }))
  assert.equal(validateGeneratedQuestions(questions, request), true)
  questions[0].options = ['square', 'square', 'circle', 'triangle']
  assert.equal(validateGeneratedQuestions(questions, request), false)
})
