import { api } from "./axios"

export async function getLesson(courseId: number, lessonId: number) {
  const { data } = await api.get(
    `/student/courses/${courseId}/lessons/${lessonId}`
  )
  return data
}

export async function completeLesson(lessonId: number) {
  const { data } = await api.post(
    `/student/lessons/${lessonId}/complete`
  )
  return data
}
