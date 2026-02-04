package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class UpdateUserRoleRequest(
    @field:NotBlank
    val role: String
)
