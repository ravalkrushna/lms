import { api } from "./api"

export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED"

export type AdminCourse = {
  id: number              
  title: string
  description?: string
  instructorId: number
  status: CourseStatus
}

export async function getAllCourses(): Promise<AdminCourse[]> {
  const { data } = await api.get("/admin/courses")
  return data
}

/* ✅ Create Course */
export type CreateCourseRequest = {
  title: string
  description?: string
}

export async function createCourse(req: CreateCourseRequest) {
  const { data } = await api.post("/instructor/courses", req)
  return data
}

/* ✅ Status Mutations */
export const publishCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/publish`)

export const unpublishCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/unpublish`)

export const archiveCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/archive`)


export type Section = {
  id: number
  title: string
  position: number
}

export async function getCourseSections(courseId: number): Promise<Section[]> {
  const { data } = await api.get(`/instructor/courses/${courseId}/sections`)
  return data
}

export type CreateSectionRequest = {
  courseId: number
  title: string
}

export async function createSection(courseId: number, title: string) {
  const { data } = await api.post(
    `/instructor/courses/${courseId}/sections`,
    { title }
  )

  return data
}

export type Lesson = {
  id: number
  title: string
  content?: string
  videoUrl?: string
  position: number
  isFreePreview: boolean
}

export async function getSectionLessons(sectionId: number) {
  const { data } = await api.get(
    `/sections/${sectionId}/lessons`
  )

  return data
}

export async function createLesson(sectionId: number, req: CreateLessonRequest) {
  const { data } = await api.post(
    `/sections/${sectionId}/lessons`,
    req
  )

  return data
}


export type CreateLessonRequest = {
  title: string
  content?: string
  videoUrl?: string
  isFreePreview: boolean
}


export type AdminUser = {
  id: number
  name: string
  email: string
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR"
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await api.get("/admin/users")
  return data
}

export const promoteInstructor = (email: string) =>
  api.post("/admin/instructors/promote", { email })
