// Central topic metadata. Child-friendly, complete names — no shortened codes
// like "G6-NA-Percent" and no visible "Grade 6". Titles focus on the learning
// area (e.g. "Number and Algebra"). One source of truth for every screen.

export const TOPICS = {
  'G6-NA-PERCENT-01': {
    title: 'Percent, Fractions, and Decimals',
    area: 'Number and Algebra',
    full: 'Number and Algebra – Percent, Fractions, and Decimals',
    icon: '%',
  },
  'G6-NA-PERCENT-02': {
    title: 'Percentage, Rate, and Base',
    area: 'Number and Algebra',
    full: 'Number and Algebra – Percentage, Rate, and Base',
    icon: 'R',
  },
  'G6-NA-PERCENT-03': {
    title: 'Percent, Discounts, and Sale Price',
    area: 'Number and Algebra',
    full: 'Number and Algebra – Percent, Discounts, and Sale Price',
    icon: 'SALE',
  },
  'G6-NA-RATIO-01': {
    title: 'Ratio and Proportion',
    area: 'Number and Algebra',
    full: 'Number and Algebra – Ratio and Proportion',
    icon: ':',
  },
  'G6-NA-DEC-01': {
    title: 'Operations on Decimals',
    area: 'Number and Algebra',
    full: 'Number and Algebra – Operations on Decimals',
    icon: '0.1',
  },
  'G6-NA-GCFLCM-01': {
    title: 'GCF and LCM',
    area: 'Number and Algebra',
    full: 'Number and Algebra – GCF and LCM',
    icon: 'x',
  },
}

export function topicTitle(ref, fallback = '') {
  return TOPICS[ref]?.title ?? fallback
}

export function topicArea(ref) {
  return TOPICS[ref]?.area ?? 'Number and Algebra'
}

// "Number and Algebra – Ratio and Proportion" — full child-friendly label.
export function topicFull(ref, fallback = '') {
  return TOPICS[ref]?.full ?? fallback
}

export function topicIcon(ref) {
  return TOPICS[ref]?.icon ?? '+'
}
