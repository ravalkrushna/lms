import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
})

export type LoginInput = z.infer<typeof LoginSchema>


export const SignupSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),

  contactNo: z.string().min(10, "Valid contact required"),
  address: z.string().min(5, "Address required"),
})

export type SignupInput = z.infer<typeof SignupSchema>

/** VERIFY OTP */
export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "Invalid OTP"),
})

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, "Invalid OTP"),

  newPassword: z.string().min(6, "Minimum 6 characters"),
  confirmNewPassword: z.string().min(6),

}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>