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

export const login = async (data: LoginRequest) => {
  await api.post("/auth/login", data)
}

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get("/auth/me")
  return data
}

export const logout = async () => {
  await api.post("/auth/logout")
}
