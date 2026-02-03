package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class CreateSectionRequest(
    @field:NotBlank(message = "Title is required")
    val title: String,
    val sortOrder: Int = 0
)
