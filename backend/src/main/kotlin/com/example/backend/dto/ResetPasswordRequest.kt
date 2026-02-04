package com.example.backend.dto

data class ResetPasswordRequest(
    val email: String,
    val otp: String,
    val newPassword: String,
    val confirmNewPassword: String
)
