import { api } from "./api"

export const getPublishedCourses = async () => {
  const response = await api.get("/courses")
  return response.data
}

export const getMyCourses = async () => {
  const response = await api.get("/student/courses")
  return response.data
}

export const getCourseDetail = async (courseId: number) => {
  const response = await api.get(`/student/courses/${courseId}`)
  return response.data
}

export const getPublicCourseDetail = async (courseId: number) => {
  const response = await api.get(`/courses/${courseId}`)
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

export const getStudentProfile = async () => {
  const response = await api.get("/student/profile")
  return response.data
}

export const enrollCourse = async (courseId: number) => {
  await api.post(`/student/courses/${courseId}/enroll`)
}