package com.example.backend.dto

data class PublicCourseDetailResponse(
    val id: Long,
    val title: String,
    val description: String?,
    val instructorName: String,
    val totalSections: Int,
    val totalLessons: Int
)
