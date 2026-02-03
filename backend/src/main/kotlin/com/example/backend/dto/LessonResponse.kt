package com.example.backend.dto

data class LessonResponse(
    val id: Long,
    val sectionId: Long,
    val title: String,
    val content: String?,
    val sortOrder: Int
)
