package com.example.backend.dto

data class InstructorSignupRequest(
    val name: String,
    val email: String,
    val password: String
)
