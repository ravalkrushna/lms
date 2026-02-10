import { api } from "./axios"

export const getStudentLesson = (lessonId: number) =>
  api.get(`/student/lessons/${lessonId}`)
    .then(res => res.data)

export const completeLesson = (lessonId: number) =>
  api.post(`/student/lessons/${lessonId}/complete`)
