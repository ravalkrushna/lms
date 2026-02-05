package com.example.backend.dto

data class StudentCourse(
    val courseId: Long,
    val title: String,
    val progressPercent: Double,
    val completed: Boolean
)
