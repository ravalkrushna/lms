import type { CreateCourseInput, CreateLessonInput, CreateSectionInput, InstructorProfileInput } from "@/schemas/instructor.schema"
import { api } from "./api"



/* ---------------- TYPES ---------------- */

export type InstructorCourse = {
  id: number
  title: string
  description?: string
  status: "DRAFT" | "PUBLISHED"
  enrollments?: number
}

export type Section = {
  id: number
  title: string
  position: number
}

export type Lesson = {
  id: number
  title: string
  position: number
  videoUrl?: string
  isFreePreview: boolean
}

/* ---------------- PROFILE ---------------- */

export const createInstructorProfile = async (
  data: InstructorProfileInput
) => {
  return api.post("/instructors/profile", data)
}

/* ---------------- COURSES ---------------- */

export const getInstructorCourses = async (): Promise<InstructorCourse[]> => {
  const res = await api.get("/instructor/courses")
  return res.data
}

export const createCourse = async (data: CreateCourseInput) => {
  const res = await api.post("/instructor/courses", data)
  return res.data
}

export const publishCourse = async (courseId: number) => {
  const res = await api.patch(`/instructor/courses/${courseId}/publish`)
  return res.data
}

export const unpublishCourse = async (courseId: number) => {
  const res = await api.patch(`/instructor/courses/${courseId}/unpublish`)
  return res.data
}

/* ---------------- SECTIONS ---------------- */

export const getSections = async (courseId: number): Promise<Section[]> => {
  const res = await api.get(`/instructor/courses/${courseId}/sections`)
  return res.data
}

export const createSection = async (
  courseId: number,
  data: CreateSectionInput
) => {
  const res = await api.post(
    `/instructor/courses/${courseId}/sections`,
    data
  )
  return res.data
}

/* ---------------- LESSONS ---------------- */

export const getLessons = async (sectionId: number): Promise<Lesson[]> => {
  const res = await api.get(`/sections/${sectionId}/lessons`)
  return res.data
}

export const createLesson = async (
  sectionId: number,
  data: CreateLessonInput
) => {
  const res = await api.post(`/sections/${sectionId}/lessons`, data)
  return res.data
}

export type InstructorUser = {
  id: number
  name: string
  email: string
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
}

export const getInstructorUsers = async (): Promise<InstructorUser[]> => {
  const res = await api.get("/instructors/users")
  return res.data
}


export type InstructorProfile = {
  name: string
  email: string
  contactNo?: string
  salary?: string
  designation?: string
  address?: string
}

/* ✅ CORRECT ENDPOINT */
export const getInstructorProfile = async (): Promise<InstructorProfile> => {
  const res = await api.get("/instructors/me")
  return res.data
}

export type UpdateInstructorPayload = {
  contactNo?: string
  address?: string
  designation?: string
  salary?: number
}

export async function updateInstructorProfile(
  data: UpdateInstructorPayload
) {
  const res = await api.put("/instructors/profile", data)
  return res.data
}


export type InstructorStats = {
  totalCourses: number
  totalStudents: number
}

export const getInstructorStats = async (): Promise<InstructorStats> => {
  const res = await api.get("/instructors/dashboard/stats")
  return res.data
}
