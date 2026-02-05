package com.example.backend.dto

data class StudentLessonResponse(
    val lessonId: Long,
    val title: String,
    val content: String?,
    val videoUrl: String?,
    val completed: Boolean
)
