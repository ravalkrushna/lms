package com.example.backend.dto

data class InstructorStudentProgress(
    val userId: Long,
    val email: String,
    val progressPercentage: Int
)
