/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api"

/* =========================================================
   SHARED TYPES
   ========================================================= */

export type CourseStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED"

/* ✅ Unified Course Type (Admin + Instructor) */
export type Course = {
  id: number
  title: string
  description?: string
  instructorId: number
  status: CourseStatus
  enrollments?: number
}

/* ✅ Unified Section Type */
export type Section = {
  id: number
  title: string
  position: number
}

/* ✅ Unified Lesson Type */
export type Lesson = {
  id: number
  title: string
  position: number
  content?: string
  videoUrl?: string
  isFreePreview: boolean
}

/* ✅ Unified User Type */
export type User = {
  id: number
  name: string
  email: string
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR"
}

/* =========================================================
   COURSES
   ========================================================= */

/*
✅ MERGE NOTE:

Admin → GET /admin/courses
Instructor → GET /instructor/courses

We keep BOTH behaviours via role-aware functions
*/

export async function getAdminCourses(): Promise<Course[]> {
  const { data } = await api.get("/admin/courses")
  return data
}

export async function getInstructorCourses(): Promise<Course[]> {
  const { data } = await api.get("/instructor/courses")
  return data
}

/* ✅ Create Course (Same endpoint used by instructor) */
export type CreateCourseRequest = {
  title: string
  description?: string
}

export async function createCourse(req: CreateCourseRequest) {
  const { data } = await api.post("/instructor/courses", req)
  return data
}

/*
✅ MERGE NOTE:

publishCourse / unpublishCourse existed in BOTH files
Endpoints are IDENTICAL → merged safely
*/

export const publishCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/publish`)

export const unpublishCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/unpublish`)

export const archiveCourse = (id: number) =>
  api.patch(`/instructor/courses/${id}/archive`)


/* =========================================================
   SECTIONS
   ========================================================= */

/*
✅ MERGE NOTE:

Both files used:
GET /instructor/courses/{id}/sections
POST /instructor/courses/{id}/sections
*/

export async function getCourseSections(courseId: number): Promise<Section[]> {
  const { data } = await api.get(`/instructor/courses/${courseId}/sections`)
  return data
}

export async function createSection(courseId: number, title: string) {
  const { data } = await api.post(
    `/instructor/courses/${courseId}/sections`,
    { title }
  )
  return data
}


/* =========================================================
   LESSONS
   ========================================================= */

/*
✅ MERGE NOTE:

Both APIs used identical lesson endpoints
*/

export async function getSectionLessons(sectionId: number): Promise<Lesson[]> {
  const { data } = await api.get(`/sections/${sectionId}/lessons`)
  return data
}

export type CreateLessonRequest = {
  title: string
  content?: string
  videoUrl?: string
  isFreePreview: boolean
}

export async function createLesson(
  sectionId: number,
  req: CreateLessonRequest
) {
  const { data } = await api.post(`/sections/${sectionId}/lessons`, req)
  return data
}


/* =========================================================
   USERS
   ========================================================= */

/*
✅ MERGE NOTE:

Admin → GET /admin/users
Instructor → GET /instructors/users

We keep BOTH
*/

export async function getAdminUsers(): Promise<User[]> {
  const { data } = await api.get("/admin/users")
  return data
}

export async function getInstructorUsers(): Promise<User[]> {
  const { data } = await api.get("/instructors/users")
  return data
}

/* ✅ Promote Instructor (Admin-only) */
export const promoteInstructor = (email: string) =>
  api.post("/admin/instructors/promote", { email })

/* ✅ Create Instructor (Admin-only) */
export async function createInstructor(data: any) {
  const res = await api.post("/admin/instructor", data)
  return res.data
}


/* =========================================================
   PROFILE
   ========================================================= */

export type Profile = {
  id?: number
  name: string
  email: string
  role?: string
  contactNo?: string
  salary?: number
  designation?: string
  address?: string
}

/*
✅ MERGE NOTE:

Admin → /auth/me
Instructor → /instructors/me
*/

export const getAdminProfile = async (): Promise<Profile> => {
  const { data } = await api.get("/auth/me")
  return data
}

export const getInstructorProfile = async (): Promise<Profile> => {
  const { data } = await api.get("/instructors/me")
  return data
}

export const getProfile = async (): Promise<Profile> => {
  try {
    const { data } = await api.get("/instructors/me")
    return data
  } catch {
    const { data } = await api.get("/auth/me")
    return data
  }
}

/* ✅ Update Instructor Profile */
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


/* =========================================================
   STATS / DASHBOARD
   ========================================================= */

export type InstructorStats = {
  totalCourses: number
  totalStudents: number
}

export const getInstructorStats = async (): Promise<InstructorStats> => {
  const res = await api.get("/instructors/dashboard/stats")
  return res.data
}

export async function getCourseById(courseId: number): Promise<Course> {
  const { data } = await api.get(`/instructor/courses/${courseId}`)
  return data
}