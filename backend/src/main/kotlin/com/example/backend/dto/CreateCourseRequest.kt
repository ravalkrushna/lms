package com.example.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateCourseRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(min = 3, max = 150, message = "Title must be 3 to 150 characters")
    val title: String,

    @field:Size(max = 1000, message = "Description too long")
    val description: String? = null
)

data class UpdateCourseRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(min = 3, max = 150, message = "Title must be 3 to 150 characters")
    val title: String,

    @field:Size(max = 1000, message = "Description too long")
    val description: String? = null,

    val isPublished: Boolean = false
)

data class CourseResponse(
    val id: Long,
    val title: String,
    val description: String?,
    val isPublished: Boolean,
    val createdByUserId: Long
)
