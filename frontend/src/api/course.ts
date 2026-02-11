import { api } from "./axios"

export type Course = {
  courseId: number
  title: string
  progressPercent: number
  completed: boolean
}

export const getStudentCourses = () =>
  api.get<Course[]>("/student/courses").then(res => res.data)

export type StudentCourseDetail = {
  courseId: number
  title: string
  sections: {
    sectionId: number
    title: string
    lessons: {
      lessonId: number
      title: string
      completed: boolean
    }[]
  }[]
}

export const getStudentCourseDetail = (courseId: number) =>
  api
    .get<StudentCourseDetail>(`/student/courses/${courseId}`)
    .then(res => res.data)
