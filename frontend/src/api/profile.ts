import type { InstructorProfile, UserProfile } from "@/types/Profile"
import { api } from "./axios"

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get("/users/me")
  return data
}

export const createUserProfile = async (payload: Partial<UserProfile>) => {
  const { data } = await api.post("/users/profile", payload)
  return data
}

// -----------------------------

export const getInstructorProfile = async (): Promise<InstructorProfile> => {
  const { data } = await api.get("/instructors/me")
  return data
}

export const createInstructorProfile = async (
  payload: Partial<InstructorProfile>
) => {
  const { data } = await api.post("/instructors/profile", payload)
  return data
}
