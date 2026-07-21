// Curriculum references are useful for grounding, but they must never become
// the subject of a learner-facing math question.
const CURRICULUM_METADATA_PROMPT = /(?:which\s+(?:learning\s+)?task\s+belongs\s+to|which\s+(?:learning\s+)?(?:goal|competenc(?:y|ies))\s+is\s+aligned\s+with|what\s+(?:learning\s+)?(?:goal|competenc(?:y|ies))\s+(?:is|are)\s+aligned\s+with|\bgrade\s*\d+\s+lesson\b|\b\d+(?:na|m|gm|sp|md)[-–][a-z0-9-]+\b)/i

function textValues(value) {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') return Object.values(value).map(String)
  return []
}

export function isLearnerFacingQuestion(question) {
  const prompt = question?.q ?? question
  const values = textValues(prompt).map((value) => value.trim()).filter(Boolean)
  return values.length > 0 && values.every((value) => !CURRICULUM_METADATA_PROMPT.test(value))
}
