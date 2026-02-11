package com.example.backend.dto

data class UserProfileResponse(
    val name: String,
    val email: String,
    val contactNo: String?,
    val address: String?,
    val collegeName: String?
)
