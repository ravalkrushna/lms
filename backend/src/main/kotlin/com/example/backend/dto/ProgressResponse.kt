package com.example.backend.dto

data class ProgressResponse(
    val totalLessons: Int,
    val completedLessons: Int,
    val percentage: Int
)
