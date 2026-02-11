package com.example.backend.dto

data class LoginResponse(
    val userId: Long,
    val email: String,
    val role: String
)