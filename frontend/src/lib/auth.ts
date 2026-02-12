import type { ForgotPasswordInput, LoginInput, ResetPasswordInput, SignupInput, VerifyOtpInput } from "@/schemas/auth.schema"
import { api } from "./api"


/** LOGIN */
export const loginAction = async (data: LoginInput) => {
  const response = await api.post("/auth/login", data)
  return response.data
}

/** SIGNUP */
export const signupAction = async (data: SignupInput) => {
  const response = await api.post("/auth/signup", data)
  return response.data
}

/* VERIFY OTP */
export const verifyOtpAction = async (data: VerifyOtpInput) => {
  const response = await api.post("/auth/verify-otp", data)
  return response.data
}

/* FORGOT PASSWORD */
export const forgotPasswordAction = async (data: ForgotPasswordInput) => {
  const response = await api.post("/auth/forgot-password", data)
  return response.data
}

/** RESET PASSWORD */
export const resetPasswordAction = async (data: ResetPasswordInput) => {
  const response = await api.post("/auth/reset-password", data)
  return response.data
}


// /** SESSION */
// export const getSessionAction = async () => {
//   try {
//     const response = await api.get("/auth/me")
//     return response.data ?? null
//   } catch {
//     return null
//   }
// }

// /** LOGOUT */
// export const logoutAction = async () => {
//   const response = await api.post("/auth/logout")
//   return response.data
// }

// /** RESET PASSWORD */
// export const resetPasswordAction = async (data: TResetPassword) => {
//   const response = await api.post("/auth/reset-password", data)
//   return response.data
// }

// /** CHANGE PASSWORD */
// export const changePasswordAction = async (data: TChangePassword) => {
//   const response = await api.post("/auth/change-password", data)
//   return response.data
// }
