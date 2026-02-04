package com.example.backend.dto

data class ChangePasswordRequest(
    val oldPassword: String,
    val newPassword: String,
    val confirmNewPassword: String
)
