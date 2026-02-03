package com.example.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SignupRequest(
    @field:NotBlank
    val name: String,

    @field:Email
    val email: String,

    @field:Size(min = 6)
    val password: String
)
