package com.example.backend.security

data class AuthUser(
    val id: Long,
    val email: String,
    val role: String
)
