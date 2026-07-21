// Compact, learner-facing labels shared by every Grade 1–6 screen. The full
// competency remains visible beneath these labels and is still used in search.

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

export function topicTitle(_ref, competency = '') {
  const text = String(competency).toLowerCase()
  return TITLE_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? fallbackTitle(competency)
}

export function topicArea(_ref, fallback = 'Number and Algebra') {
  return fallback
}

export function topicFull(ref, competency = '', domain = '') {
  const title = topicTitle(ref, competency)
  return domain ? `${domain} – ${title}` : title
}

export function topicIcon(ref) {
  if (/SP|DP/.test(ref)) return '▥'
  if (/MG/.test(ref)) return '△'
  return '#'
}
