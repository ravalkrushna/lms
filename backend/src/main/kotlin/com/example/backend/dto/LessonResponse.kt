package com.example.backend.dto

import java.time.Instant

data class LessonResponse(
    val id: Long,
    val sectionId: Long,
    val title: String,
    val content: String?,
    val videoUrl: String?,
    val position: Int,
    val isFreePreview: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant
)