package com.example.backend.dto

data class SectionResponse(
    val id: Long,
    val courseId: Long,
    val title: String,
    val position: Int
)
