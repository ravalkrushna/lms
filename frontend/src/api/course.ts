import { api } from "./axios"

export type Course = {
  courseId: number
  title: string
  progressPercent: number
  completed: boolean
}

export const getStudentCourses = () =>
  api.get<Course[]>("/student/courses").then(res => res.data)
