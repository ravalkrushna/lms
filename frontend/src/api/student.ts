import { api } from "./axios"
import type { StudentCourse } from "@/types/StudentCourse"

export const getStudentCourse = (courseId: number) =>
  api
    .get<StudentCourse>(`/student/courses/${courseId}`)
    .then(res => res.data)
