package com.example.backend.dto

data class AdminUserResponse(
    val id: Long,
    val name: String,
    val email: String,
    val role: String
)
{
}