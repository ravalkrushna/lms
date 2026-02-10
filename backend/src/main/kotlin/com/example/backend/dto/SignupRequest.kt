package com.example.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class SignupRequest(

    val name: String? = null,

    @field:Email
    val email: String,

    @field:Size(min = 6)
    val password: String
)
