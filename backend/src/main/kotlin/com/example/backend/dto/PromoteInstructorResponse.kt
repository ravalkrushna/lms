package com.example.backend.dto

data class PromoteInstructorResponse(

    val userId: Long,
    val role: String,

    val instructorProfileCreated: Boolean
)

