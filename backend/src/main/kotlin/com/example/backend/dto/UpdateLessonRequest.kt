package com.example.backend.dto

data class UpdateLessonRequest(
    val title: String? = null,
    val content: String? = null,
    val videoUrl: String? = null,
    val position: Int? = null,
    val isFreePreview: Boolean? = null
)