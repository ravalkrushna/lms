package com.example.backend.dto

import java.time.Instant

data class PublicCourseResponse(
    val id: Long,
    val title: String,
    val description: String?,
    val instructorName: String,
    val enrolledCount: Long,
    val createdAt: Instant
)


