import grade6 from '../content.json'

// Add reviewed Grade 1-5 files here as they become available. Keeping this
// module as the only curriculum entry point prevents screens from accidentally
// mixing grades.
const ALL = [...grade6]

export const getAllContent = () => ALL
export const getContentByGrade = (grade) => ALL.filter((c) => c.grade === Number(grade))
export const getContentByRef = (ref) => ALL.find((c) => c.ref === ref)
