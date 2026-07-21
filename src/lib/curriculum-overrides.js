import teachingOverrides from '../curriculum/teaching-overrides.json' with { type: 'json' }

const localized = (en, fil, taglish) => ({ en, fil, taglish })

function fourNearbyValues(correct, seed) {
  const values = [correct, Math.max(1, correct - 1), correct + 1, seed, correct + 2]
  return [...new Set(values)].slice(0, 4)
}

function sourceLengths(item) {
  const values = [...String(item.q?.en ?? '').matchAll(/(\d+)\s*m\b/g)].map((match) => Number(match[1]))
  return [values[0] ?? 5, values[1] ?? 8]
}

function measuredItem(item, index) {
  const [length, seed] = sourceLengths(item)
  const objects = [
    ['crayon', 'krayola'],
    ['eraser', 'pambura'],
    ['leaf', 'dahon'],
    ['spoon', 'kutsara'],
    ['ribbon', 'laso'],
    ['book', 'aklat'],
    ['toy car', 'laruang kotse'],
    ['piece of chalk', 'piraso ng yeso'],
    ['paintbrush', 'pinsel'],
    ['drinking straw', 'straw'],
    ['notebook', 'kuwaderno'],
    ['marker', 'pananda'],
  ]
  const [objectEn, objectFil] = objects[index % objects.length]
  const answer = `${length} paper clips`
  const options = fourNearbyValues(length, seed).map((value) => `${value} paper clips`)

  return {
    ...item,
    q: localized(
      `A ${objectEn} lines up with ${length} equal paper clips without gaps or overlaps. What is its length?`,
      `Nakapantay ang ${objectFil} sa ${length} magkakapantay na paper clip na walang puwang o patong. Ano ang haba nito?`,
      `A ${objectEn} lines up with ${length} equal paper clips, walang gaps or overlaps. Ano ang length nito?`,
    ),
    answer,
    type: 'mcq',
    options: index % 2 === 0 ? options : [...options.slice(1), options[0]],
    solution: localized(
      `Count the equal units from end to end. The ${objectEn} is ${answer} long.`,
      `Bilangin ang magkakapantay na unit mula dulo hanggang dulo. Ang haba ng ${objectFil} ay ${length} paper clip.`,
      `Count the equal units end to end. The ${objectEn} is ${answer} long.`,
    ),
  }
}

function comparisonItem(item, index) {
  const [first, second] = sourceLengths(item)
  const answer = first === second ? 'same length' : first > second ? 'first garden row' : 'second garden row'
  const options = ['first garden row', 'second garden row', 'same length', 'not enough information']

  return {
    ...item,
    q: localized(
      `In garden pair ${index + 1}, the first row is ${first} m long and the second is ${second} m long. Which statement is correct?`,
      `Sa pares ${index + 1} sa hardin, ang unang hanay ay ${first} m ang haba at ang ikalawa ay ${second} m. Aling pahayag ang tama?`,
      `In garden pair ${index + 1}, the first row is ${first} m long at ${second} m ang second row. Aling statement ang correct?`,
    ),
    answer,
    type: 'mcq',
    options: index % 2 === 0 ? options : [options[1], options[0], options[2], options[3]],
    solution: localized(
      `${Math.max(first, second)} is ${first === second ? 'equal to' : 'greater than'} ${Math.min(first, second)}, so the ${answer} is correct.`,
      `${first === second ? `Magkapantay ang ${first} at ${second}` : `Mas malaki ang ${Math.max(first, second)} kaysa ${Math.min(first, second)}`}, kaya tama ang sagot na “${answer === 'first garden row' ? 'unang hanay sa hardin' : answer === 'second garden row' ? 'ikalawang hanay sa hardin' : 'magkapantay ang haba'}.”`,
      `Compare ${first} and ${second}. The correct answer is ${answer}.`,
    ),
  }
}

function lengthProblemItem(item, index) {
  const [first, second] = sourceLengths(item)
  const section = String.fromCharCode(65 + index)
  const total = first + second
  const answer = `${total} m`
  const options = fourNearbyValues(total, Math.abs(first - second)).map((value) => `${value} m`)

  return {
    ...item,
    q: localized(
      `In garden section ${section}, one row is ${first} m long and another is ${second} m long. What is their total length?`,
      `Sa bahagi ${section} ng hardin, ang isang hanay ay ${first} m ang haba at ang isa pa ay ${second} m. Ano ang kabuuang haba ng dalawa?`,
      `In garden section ${section}, one row is ${first} m long at ${second} m ang isa pa. Ano ang total length nila?`,
    ),
    answer,
    type: 'mcq',
    options: index % 2 === 0 ? options : [...options.slice(1), options[0]],
    solution: localized(
      `Add the two lengths: ${first} m + ${second} m = ${answer}.`,
      `Pagsamahin ang dalawang haba: ${first} m + ${second} m = ${answer}.`,
      `Add the two lengths: ${first} m + ${second} m = ${answer}.`,
    ),
  }
}

function countingSequenceItem(item, index) {
  const values = [...String(item.q?.en ?? '').matchAll(/\d+/g)].slice(0, 3).map((match) => Number(match[0]))
  const [first = 28, second = 30, third = 32] = values
  const step = second - first || third - second || 1
  const fourth = third + step
  const fifth = fourth + step
  const answer = `${fourth}, ${fifth}`
  const labelEn = index === 0 ? '' : `Number trail ${index + 1}: `
  const labelFil = index === 0 ? '' : `Landas ng bilang ${index + 1}: `
  const options = [
    answer,
    `${fourth + 1}, ${fifth + 1}`,
    `${third}, ${fourth}`,
    `${fourth - step}, ${fifth + step}`,
  ]

  return {
    ...item,
    q: localized(
      `${labelEn}Continue the count: ${first}, ${second}, ${third}, __, __.`,
      `${labelFil}Ipagpatuloy ang bilang: ${first}, ${second}, ${third}, __, __.`,
      `${labelEn}Continue the count: ${first}, ${second}, ${third}, __, __.`,
    ),
    answer,
    type: 'mcq',
    options: index % 2 === 0 ? options : [...options.slice(1), options[0]],
    solution: localized(
      `The pattern changes by ${step} each time. ${third} + ${step} = ${fourth}, then ${fourth} + ${step} = ${fifth}.`,
      `Nadadagdagan ng ${step} ang bawat bilang. ${third} + ${step} = ${fourth}, pagkatapos ${fourth} + ${step} = ${fifth}.`,
      `The pattern adds ${step} each time. ${third} + ${step} = ${fourth}, then ${fourth} + ${step} = ${fifth}.`,
    ),
  }
}

const COMPETENCY_REPAIRS = Object.freeze({
  '1NA-Ib-1': Object.freeze({
    repairItem: countingSequenceItem,
    explanation: localized(
      'A counting pattern follows the same change each time. Compare neighboring numbers to find the change, then repeat it.',
      'Ang pattern sa pagbilang ay may parehong pagbabago sa bawat hakbang. Ihambing ang magkatabing bilang, hanapin ang pagbabago, at ulitin ito.',
      'A counting pattern uses the same change each step. Compare nearby numbers, find the change, then repeat it.',
    ),
    worked_example_prompt: localized(
      'Continue the count: 28, 30, 32, __, __.',
      'Ipagpatuloy ang bilang: 28, 30, 32, __, __.',
      'Continue the count: 28, 30, 32, __, __.',
    ),
    worked_example_steps: [
      localized('Compare neighboring numbers: 30 − 28 = 2 and 32 − 30 = 2.', 'Ihambing ang magkatabing bilang: 30 − 28 = 2 at 32 − 30 = 2.', 'Compare nearby numbers: 30 − 28 = 2 and 32 − 30 = 2.'),
      localized('Keep adding 2: 32 + 2 = 34, then 34 + 2 = 36.', 'Patuloy na magdagdag ng 2: 32 + 2 = 34, pagkatapos 34 + 2 = 36.', 'Keep adding 2: 32 + 2 = 34, then 34 + 2 = 36.'),
    ],
    worked_example_answer: localized('The missing numbers are 34 and 36.', 'Ang nawawalang mga bilang ay 34 at 36.', 'The missing numbers are 34 and 36.'),
    example_visual: 'skipCounting',
  }),
  '1MG-Ii-1': Object.freeze({
    repairItem: measuredItem,
    explanation: localized(
      'Measure with equal non-standard units placed end to end, with no gaps or overlaps.',
      'Magsukat gamit ang magkakapantay na di-karaniwang unit na magkakadugtong at walang puwang o patong.',
      'Measure using equal non-standard units placed end to end, walang gaps or overlaps.',
    ),
    worked_example_prompt: localized(
      'A pencil lines up with 5 equal blocks. How long is the pencil?',
      'Nakapantay ang lapis sa 5 magkakapantay na bloke. Ano ang haba ng lapis?',
      'A pencil lines up with 5 equal blocks. Ano ang length ng pencil?',
    ),
    worked_example_steps: [
      localized('Start both the pencil and the first block at the same point.', 'Itapat sa iisang panimulang punto ang lapis at unang bloke.', 'Start the pencil and first block at the same point.'),
      localized('Count the blocks from end to end: 1, 2, 3, 4, 5.', 'Bilangin ang magkakadugtong na bloke: 1, 2, 3, 4, 5.', 'Count the blocks end to end: 1, 2, 3, 4, 5.'),
    ],
    worked_example_answer: localized('The pencil is 5 blocks long.', 'Ang haba ng lapis ay 5 bloke.', 'The pencil is 5 blocks long.'),
    example_visual: 'pencilBlocks',
  }),
  '1MG-Ij-1': Object.freeze({
    repairItem: comparisonItem,
    explanation: localized('Compare lengths by using the same unit. The greater measurement is longer.', 'Ihambing ang haba gamit ang parehong unit. Mas mahaba ang may mas malaking sukat.', 'Compare lengths using the same unit. Mas mahaba ang greater measurement.'),
    worked_example_prompt: localized('One garden row is 5 m long and another is 8 m. Which is longer?', 'Ang isang hanay sa hardin ay 5 m ang haba at ang isa ay 8 m. Alin ang mas mahaba?', 'One garden row is 5 m at another is 8 m. Alin ang longer?'),
    worked_example_steps: [localized('Compare 5 and 8.', 'Ihambing ang 5 at 8.', 'Compare 5 and 8.'), localized('Since 8 is greater than 5, the 8 m row is longer.', 'Dahil mas malaki ang 8 kaysa 5, mas mahaba ang hanay na 8 m.', 'Since 8 is greater than 5, longer ang 8 m row.')],
    worked_example_answer: localized('The 8 m garden row is longer.', 'Mas mahaba ang hanay sa hardin na 8 m.', 'The 8 m garden row is longer.'),
    example_visual: 'gardenRows',
  }),
  '1MG-Ij-2': Object.freeze({
    repairItem: lengthProblemItem,
    explanation: localized('To find a total length, add measurements that use the same unit.', 'Upang makuha ang kabuuang haba, pagsamahin ang mga sukat na gumagamit ng parehong unit.', 'To find total length, add measurements with the same unit.'),
    worked_example_prompt: localized('One garden row is 5 m long and another is 8 m. What is their total length?', 'Ang isang hanay sa hardin ay 5 m ang haba at ang isa ay 8 m. Ano ang kabuuang haba nila?', 'One garden row is 5 m long at 8 m ang isa. Ano ang total length?'),
    worked_example_steps: [localized('Write the addition sentence: 5 m + 8 m.', 'Isulat ang addition sentence: 5 m + 8 m.', 'Write the addition sentence: 5 m + 8 m.'), localized('Add: 5 + 8 = 13. Keep the unit metres.', 'Mag-add: 5 + 8 = 13. Isama ang unit na metro.', 'Add: 5 + 8 = 13. Keep the unit metres.')],
    worked_example_answer: localized('Their total length is 13 m.', 'Ang kabuuang haba nila ay 13 m.', 'Their total length is 13 m.'),
    example_visual: 'gardenRows',
  }),
})

function applyItemOverrides(items, itemOverrides) {
  if (!itemOverrides) return items

  return items.map((item, index) => {
    const override = itemOverrides[String(index)]
    return override ? { ...item, ...override } : item
  })
}

export function applyCurriculumOverrides(curriculum) {
  return curriculum.map((competency) => {
    const override = teachingOverrides[competency.ref]
    const { item_overrides: itemOverrides, ...lessonOverride } = override ?? {}
    const overridden = override ? {
      ...competency,
      ...lessonOverride,
      items: applyItemOverrides(competency.items, itemOverrides),
    } : competency
    const competencyRepair = COMPETENCY_REPAIRS[competency.ref]
    if (!competencyRepair) return overridden

    const { repairItem, ...teaching } = competencyRepair
    return {
      ...overridden,
      ...teaching,
      items: overridden.items.map(repairItem),
    }
  })
}
