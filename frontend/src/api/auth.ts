import { api } from "./axios"

export type LoginRequest = {
  email: string
  password: string
}

export type MeResponse = {
  id: number
  email: string
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"
}

export const signup = (payload: {
  email: string
  password: string
}) => api.post("/auth/signup", payload)

export const verifyOtp = (payload: {
  email: string
  otp: string
}) => api.post("/auth/verify-otp", payload)

export const login = async (
  data: LoginRequest
): Promise<MeResponse> => {
  await api.post("/auth/login", data)

  const { data: user } = await api.get("/auth/me")

  return user
}

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get("/auth/me")
  return data
}

export const logout = async () => {
  await api.post("/auth/logout")
}
