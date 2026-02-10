export type StudentLesson = {
  lessonId: number
  title: string
  completed: boolean
}

export type StudentSection = {
  sectionId: number
  title: string
  lessons: StudentLesson[]
}

export type StudentCourse = {
  courseId: number
  title: string
  sections: StudentSection[]
}
