import { z } from "zod"

/* ---------------- PROFILE ---------------- */

export const InstructorProfileSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  bio: z.string().min(10, "Bio required"),
  expertise: z.string().min(2, "Expertise required"),
})

export type InstructorProfileInput =
  z.infer<typeof InstructorProfileSchema>

export const UpdateInstructorSchema = InstructorProfileSchema

export type UpdateInstructorInput =
  z.infer<typeof UpdateInstructorSchema>

/* ---------------- COURSES ---------------- */

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
})

export type CreateCourseInput =
  z.infer<typeof CreateCourseSchema>

/* ---------------- SECTIONS ---------------- */

export const CreateSectionSchema = z.object({
  title: z.string().min(2, "Section title required"),
})

export type CreateSectionInput =
  z.infer<typeof CreateSectionSchema>

/* ---------------- LESSONS ---------------- */

export const CreateLessonSchema = z.object({
  title: z.string().min(2, "Lesson title required"),
  videoUrl: z.string().url("Invalid URL").optional(),
  content: z.string().optional(),
  isFreePreview: z.boolean().optional()
})

export type CreateLessonInput = z.infer<typeof CreateLessonSchema>
