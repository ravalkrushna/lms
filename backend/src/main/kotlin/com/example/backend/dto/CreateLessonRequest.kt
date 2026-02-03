package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class CreateLessonRequest(
    @field:NotBlank(message = "Title is required")
    val title: String,
    val content: String? = null,
    val sortOrder: Int = 0
)
