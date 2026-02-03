package com.example.backend.dto

data class SessionResponse(
    val userId: Long,
    val name: String,
    val email: String
)
