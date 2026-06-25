// Central topic metadata for the full Grade 6 MATATAG curriculum (3 terms,
// 21 competencies). Child-friendly titles — no "Grade 6", no raw codes in the
// title. `area` is the learning domain; `full` is "Area – Title". One source of
// truth for every screen. Keys are the official DepEd competency codes.

export const TOPICS = {
  // ---- Term 1 — Number & Algebra (+ intro Geometry) ----
  '6NA-Ia-1': { title: 'Operations on Decimals', area: 'Number and Algebra', icon: '0.1' },
  '6NA-Ib-2': { title: 'Decimal Word Problems', area: 'Number and Algebra', icon: '₱' },
  '6NA-Ic-3': { title: 'Adding & Subtracting Fractions', area: 'Number and Algebra', icon: '½' },
  '6NA-Id-4': { title: 'Multiplying & Dividing Fractions', area: 'Number and Algebra', icon: '⅔' },
  '6NA-Ie-5': { title: 'GCF and LCM', area: 'Number and Algebra', icon: 'GCF' },
  '6NA-If-6': { title: 'Exponents & GEMDAS', area: 'Number and Algebra', icon: 'x²' },
  '6MG-Ig-7': { title: 'Tessellation', area: 'Measurement and Geometry', icon: '▲' },

  // ---- Term 2 — Ratio, Percent, Angles, Volume ----
  '6NA-IIa-1': { title: 'Ratio and Proportion', area: 'Number and Algebra', icon: ':' },
  '6NA-IIb-2': { title: 'Direct & Partitive Proportion', area: 'Number and Algebra', icon: '1:2' },
  '6NA-IIc-3': { title: 'Percentage, Rate, and Base', area: 'Number and Algebra', icon: '%' },
  '6NA-IId-4': { title: 'Percent in Daily Life', area: 'Number and Algebra', icon: 'SALE' },
  '6MG-IIe-5': { title: 'Angles', area: 'Measurement and Geometry', icon: '∠' },
  '6MG-IIf-6': { title: 'Transformations', area: 'Measurement and Geometry', icon: '↻' },
  '6MG-IIg-7': { title: 'Volume & Capacity', area: 'Measurement and Geometry', icon: 'V' },

  // ---- Term 3 — Plane Figures, Circles, Data & Probability ----
  '6MG-IIIa-1': { title: 'Triangles & Quadrilaterals', area: 'Measurement and Geometry', icon: '△' },
  '6MG-IIIb-2': { title: 'Perimeter and Area', area: 'Measurement and Geometry', icon: '▭' },
  '6MG-IIIc-3': { title: 'Circles: Parts & Circumference', area: 'Measurement and Geometry', icon: '◯' },
  '6MG-IIId-4': { title: 'Area of Circles & Composite Figures', area: 'Measurement and Geometry', icon: 'π' },
  '6DP-IIIe-5': { title: 'Pie Graphs & Data', area: 'Data and Probability', icon: '◑' },
  '6DP-IIIf-6': { title: 'Mean, Median, and Mode', area: 'Data and Probability', icon: 'x̄' },
  '6DP-IIIg-7': { title: 'Simple Probability', area: 'Data and Probability', icon: '?' },
}

export function topicTitle(ref, fallback = '') {
  return TOPICS[ref]?.title ?? fallback
}

export function topicArea(ref) {
  return TOPICS[ref]?.area ?? 'Number and Algebra'
}

// "Number and Algebra – Ratio and Proportion" — full child-friendly label.
export function topicFull(ref, fallback = '') {
  const t = TOPICS[ref]
  return t ? `${t.area} – ${t.title}` : fallback
}

export function topicIcon(ref) {
  return TOPICS[ref]?.icon ?? '+'
}
