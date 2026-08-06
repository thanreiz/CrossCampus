// Compact, learner-facing labels shared by every Grade 1–6 screen. The full
// competency remains visible beneath these labels and is still used in search.

// Some competencies mention a supporting operation after the main skill
// (for example, division as repeated subtraction). Reference-specific titles
// keep those descriptions from matching a broader rule below.
const REF_TITLES = {
  '1NA-IIc-1': 'Tens and Ones',
  '1NA-IIIh-1': 'Money Problems',
  '2NA-IIc-1': 'Subtraction',
  '2NA-IIi-1': 'Equal Groups',
  '2NA-IIj-1': 'Multiplication',
  '2NA-IIIc-1': 'Division',
  '2NA-IIId-1': 'Missing Factors',
  '2NA-IIId-2': 'Even and Odd',
  '3MG-IIb-3': 'Comparing Capacity',
  '3NA-IIIh-4': 'Fraction Operations',
  '4NA-Ie-3': 'Fractions on Lines',
  '4MG-Id-2': 'Perimeter',
  '4NA-If-3': 'Estimating Operations',
  '4NA-Ig-1': 'Mixed Operations',
  '4NA-Ig-2': 'Multiplication',
  '4NA-Ii-2': 'Division',
  '4NA-IIg-1': 'Dissimilar Fractions',
  '4NA-IIg-2': 'Dissimilar Fractions',
  '4NA-IIh-1': 'Dissimilar Fractions',
  '4NA-IIIa-1': 'Dissimilar Fractions',
  '4NA-IIIb-1': 'Dissimilar Fractions',
  '4NA-IIIc-1': 'Fraction Operations',
  '5NA-Ie-1': 'Fraction Multiplication',
  '5MG-If-3': 'Area',
  '5NA-IIc-1': 'Decimal Operations',
  '5SP-IIf-2': 'Choosing Graphs',
  '5NA-IIIa-3': 'Decimal Multiplication',
  '5MG-IIIh-2': 'Surface Area',
  '5MG-IIIi-1': 'Surface Area',
  '6NA-Ic-2': 'Decimal Operations',
  '6NA-Id-2': 'Decimal Multiplication',
  '6NA-If-2': 'Fraction Multiplication',
  '6NA-If-3': 'Fraction Multiplication',
  '6NA-Ih-1': 'Fraction Division',
  '6NA-Ih-2': 'Fraction Division',
  '6MG-IIg-2': 'Volume',
  '6MG-IIIb-2': 'Understanding Pi',
  '6SP-IIIf-1': 'Pie Graphs',
  '6SP-IIIg-2': 'Digital Data',
  '6NA-IIIi-3': 'GCF and LCM',
}

const TITLE_RULES = [
  [/12- and 24-hour|12-hour time|24-hour time/, 'Time Systems'],
  [/world time zone/, 'Time Zones'],
  [/elapsed time|duration of an event/, 'Elapsed Time'],
  [/analog clock|problems involving time|days of the week|months of the year|using a calendar/, 'Time and Calendar'],
  [/coins|bills|currency|money in words|denominations of peso/, 'Money'],
  [/ordinal number/, 'Ordinal Numbers'],
  [/compose and decompose numbers/, 'Number Bonds'],
  [/place value.*decimal|decimal.*place value/, 'Decimal Place Value'],
  [/place value/, 'Place Value'],
  [/read and write decimal/, 'Reading Decimals'],
  [/read and write.*fraction/, 'Reading Fractions'],
  [/read and write (?:numbers|numerals)|write numerals/, 'Reading Numbers'],
  [/represent numbers up to|recognize and represent numbers/, 'Number Models'],
  [/count by|counts by/, 'Skip Counting'],
  [/count up to/, 'Counting Numbers'],
  [/compare.*numbers up to/, 'Comparing Numbers'],
  [/order numbers up to/, 'Ordering Numbers'],
  [/round decimal/, 'Rounding Decimals'],
  [/round numbers/, 'Rounding Numbers'],
  [/estimate the sum/, 'Estimating Sums'],
  [/estimate the difference/, 'Estimating Differences'],
  [/estimate.*product/, 'Estimating Products'],
  [/estimate.*quotient/, 'Estimating Quotients'],
  [/missing number.*addition or subtraction|equivalent expression|number sentence.*property|number facts/, 'Number Sentences'],
  [/properties of addition/, 'Addition Properties'],
  [/addition and subtraction|add and subtract numbers|four operations|different operations/, 'Mixed Operations'],
  [/addition|add numbers|sum of addends/, 'Addition'],
  [/subtraction|subtract numbers|difference of two/, 'Subtraction'],
  [/properties of multiplication/, 'Multiplication Properties'],
  [/multiplication as repeated|multiply numbers|multiplication problem/, 'Multiplication'],
  [/division through|division expressions|divide numbers|division problem|division by/, 'Division'],
  [/even and odd/, 'Even and Odd'],
  [/divisibility rules/, 'Divisibility Rules'],
  [/prime numbers.*composite/, 'Prime Numbers'],
  [/greatest common factor|\bgcf\b/, 'GCF'],
  [/least common multiple|\blcm\b/, 'LCM'],
  [/common factors|all the factors/, 'Factors'],
  [/multiples of given/, 'Multiples'],
  [/exponential form/, 'Exponents'],
  [/gemdas|gmdas|mdas/, 'Operation Rules'],
  [/repeating pattern|increasing or decreasing pattern|generate a given.*pattern|pattern with repeating|simple pattern/, 'Patterns'],
  [/unit fractions/, 'Unit Fractions'],
  [/similar fractions/, 'Similar Fractions'],
  [/dissimilar fractions/, 'Dissimilar Fractions'],
  [/proper fractions.*improper|improper fractions|mixed numbers/, 'Fraction Forms'],
  [/equivalent fractions/, 'Equivalent Fractions'],
  [/simplest form/, 'Simplifying Fractions'],
  [/fractions.*equal to one|greater than one/, 'Fractions Above One'],
  [/halves and quarters|1\/2 and 1\/4/, 'Halves and Quarters'],
  [/multiply.*fraction|multiplication of fractions/, 'Fraction Multiplication'],
  [/divide.*fraction|division of fractions/, 'Fraction Division'],
  [/add and subtract.*fraction|addition.*subtraction of fractions/, 'Fraction Operations'],
  [/fractions.*decimals|decimals to fractions|decimal numbers to fractions/, 'Fractions and Decimals'],
  [/add and subtract decimal|addition.*subtraction of decimals/, 'Decimal Operations'],
  [/multiply decimal|multiplication of decimals/, 'Decimal Multiplication'],
  [/divide:.*decimal|divide.*decimal|division of decimals|mentally divide/, 'Decimal Division'],
  [/mentally multiply decimals/, 'Decimal Multiplication'],
  [/compare and order decimal/, 'Comparing Decimals'],
  [/decimal numbers/, 'Decimals'],
  [/ratio and proportion/, 'Ratio and Proportion'],
  [/equivalent ratios/, 'Equivalent Ratios'],
  [/\bratio\b/, 'Ratios'],
  [/percentages.*fractions.*decimals/, 'Percent Connections'],
  [/percentages|percentage/, 'Percentages'],
  [/simple probability|theoretical probability|chance of an event|possible outcomes/, 'Probability'],
  [/equally likely|least likely|most likely|certain, and impossible/, 'Likelihood'],
  [/collect.*bivariate data/, 'Bivariate Data'],
  [/collect data/, 'Collecting Data'],
  [/double bar graph|double line graph/, 'Double Graphs'],
  [/single bar graph|bar graphs/, 'Bar Graphs'],
  [/single line graph|line graph/, 'Line Graphs'],
  [/pie graph/, 'Pie Graphs'],
  [/pictograph/, 'Pictographs'],
  [/tabular|tables/, 'Data Tables'],
  [/digital media.*graphical/, 'Digital Data'],
  [/data presented|using data|make inferences.*data/, 'Data Analysis'],
  [/2-dimensional shapes|two-dimensional shapes/, '2D Shapes'],
  [/circles, half circles|composite figures made up/, 'Composite Shapes'],
  [/compose and decompose triangles/, 'Building Shapes'],
  [/solid figures and their nets|solid figures.*nets/, 'Shape Nets'],
  [/solid figures|3-dimensional objects|prisms and pyramids|cubes and rectangular prisms/, '3D Shapes'],
  [/triangles and quadrilaterals|classify triangles|properties of triangles|different quadrilaterals/, 'Triangles and Quadrilaterals'],
  [/circles with different radii|draw circles/, 'Drawing Circles'],
  [/parts of a circle/, 'Circle Parts'],
  [/circumference.*area of circles/, 'Circle Problems'],
  [/circumference/, 'Circumference'],
  [/area of a circle|area.*circles/, 'Circle Area'],
  [/approximate the value of pi/, 'Understanding Pi'],
  [/different angles|measure and draw angles/, 'Angles'],
  [/point, line, line segment|parallel, intersecting|straight and curved lines|line segments/, 'Lines'],
  [/line symmetry|symmetric.*line|symmetry with respect/, 'Symmetry'],
  [/translation, reflection, rotation|multi-step slide|applying reflection|applying rotation/, 'Transformations'],
  [/half turn|quarter turn/, 'Turns and Direction'],
  [/tessellat/, 'Tessellation'],
  [/perimeter and area/, 'Perimeter and Area'],
  [/perimeter/, 'Perimeter'],
  [/surface area/, 'Surface Area'],
  [/area of composite|composite figures/, 'Composite Area'],
  [/areas? of (?:a )?square|areas of squares|area of a parallelogram|areas of triangles/, 'Area'],
  [/length and distance|lengths and distances|lengths? of objects|measure the length|estimate length/, 'Length and Distance'],
  [/height of a parallelogram/, 'Shape Heights'],
  [/mass|masses/, 'Mass'],
  [/capacity/, 'Capacity'],
  [/volume/, 'Volume'],
  [/convert common units|conversion of units/, 'Unit Conversion'],
  [/convert cu\. cm/, 'Volume Conversion'],
  [/convert sq\. cm/, 'Area Conversion'],
  [/convert time measures/, 'Time Conversion'],
]

const LEADING_WORDS = new Set([
  'identify', 'illustrate', 'represent', 'recognize', 'describe', 'determine',
  'explore', 'find', 'solve', 'perform', 'compare', 'construct', 'interpret',
  'present', 'draw', 'write', 'read', 'create', 'complete', 'calculate', 'give',
])

function fallbackTitle(competency = '') {
  const words = String(competency)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  while (words.length && LEADING_WORDS.has(words[0].toLowerCase())) words.shift()
  return words.slice(0, 3).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Math Topic'
}

export function topicTitle(ref, competency = '') {
  if (REF_TITLES[ref]) return REF_TITLES[ref]
  const text = String(competency).toLowerCase()
  return TITLE_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? fallbackTitle(competency)
}

const FILIPINO_TITLES = Object.freeze({
  'Counting Numbers': 'Pagbilang ng mga Numero',
  'Reading Numbers': 'Pagbasa ng mga Numero',
  'Number Models': 'Mga Modelo ng Numero',
  'Comparing Numbers': 'Paghahambing ng mga Numero',
  'Ordering Numbers': 'Pagsasaayos ng mga Numero',
  'Ordinal Numbers': 'Mga Ordinal na Numero',
  'Number Bonds': 'Ugnayan ng mga Numero',
  '2D Shapes': 'Mga Hugis na 2D',
  'Building Shapes': 'Pagbuo ng mga Hugis',
  'Composite Shapes': 'Pinagsamang mga Hugis',
  '3D Shapes': 'Mga Hugis na 3D',
  'Length and Distance': 'Haba at Layo',
  Addition: 'Pagdaragdag',
  Subtraction: 'Pagbabawas',
  Multiplication: 'Pagpaparami',
  Division: 'Paghahati',
  Patterns: 'Mga Pattern',
  Money: 'Pera',
  'Time and Calendar': 'Oras at Kalendaryo',
  'Turns and Direction': 'Pagliko at Direksiyon',
  Pictographs: 'Mga Larawang Grap',
  'Collecting Data': 'Pangangalap ng Datos',
})

const FILIPINO_DOMAINS = Object.freeze({
  'Number and Algebra': 'Bilang at Algebra',
  'Measurement and Geometry': 'Pagsukat at Heometriya',
  'Data and Probability': 'Datos at Probabilidad',
  'Statistics and Probability': 'Estadistika at Probabilidad',
})

export function topicTitleLocalized(ref, competency = '', lang = 'en') {
  const title = topicTitle(ref, competency)
  return lang === 'fil' ? FILIPINO_TITLES[title] ?? title : title
}

export function topicArea(_ref, fallback = 'Number and Algebra') {
  return fallback
}

export function topicFull(ref, competency = '', domain = '', lang = 'en') {
  const title = topicTitleLocalized(ref, competency, lang)
  const localizedDomain = lang === 'fil' ? FILIPINO_DOMAINS[domain] ?? domain : domain
  return localizedDomain ? `${localizedDomain} – ${title}` : title
}

export function topicIcon(ref) {
  if (/SP|DP/.test(ref)) return '▥'
  if (/MG/.test(ref)) return '△'
  return '#'
}
