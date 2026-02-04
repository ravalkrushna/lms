package com.example.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateCourseRequest(
    @field:NotBlank
    @field:Size(min = 3, max = 200)
    val title: String,

    val description: String? = null
)
