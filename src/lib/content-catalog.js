import grade1 from '../curriculum/grade1.json' with { type: 'json' }
import grade2 from '../curriculum/grade2.json' with { type: 'json' }
import grade3 from '../curriculum/grade3.json' with { type: 'json' }
import grade4 from '../curriculum/grade4.json' with { type: 'json' }
import grade5 from '../curriculum/grade5.json' with { type: 'json' }
import grade6 from '../curriculum/grade6.json' with { type: 'json' }

const ALL = [...grade1, ...grade2, ...grade3, ...grade4, ...grade5, ...grade6]

export const getAllContent = () => ALL
export const getContentByGrade = (grade) => ALL.filter((competency) => competency.grade === Number(grade))
export const getContentByRef = (ref) => ALL.find((competency) => competency.ref === ref)
