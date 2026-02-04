package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class UpdateSectionRequest(
    @field:NotBlank(message = "Title is required")
    val title: String
)
