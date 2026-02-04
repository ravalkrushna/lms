package com.example.backend.dto

data class CourseResponse(
    val id: Long,
    val title: String,
    val description: String?,
    val instructorId: Long,
    val status: String
)
