import { api } from "./api"

export const getEnrolledCourses = async () => {
  const response = await api.get("/student/courses")
  return response.data
}


export const getStudentProfile = async () => {
  const response = await api.get("/student/profile")
  return response.data
}


export const getCourseDetail = async (courseId: number) => {
  const response = await api.get(`/student/courses/${courseId}`)
  return response.data
}


export const getLessonDetail = async (lessonId: number) => {
  const response = await api.get(`/student/lessons/${lessonId}`)
  return response.data
}


export const completeLesson = async (lessonId: number) => {
  const response = await api.post(`/student/lessons/${lessonId}/complete`)
  return response.data
}
