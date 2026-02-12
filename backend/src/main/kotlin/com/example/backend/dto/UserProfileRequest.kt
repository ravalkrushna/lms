package com.example.backend.dto

data class UserProfileRequest(
    val name: String,
    val contactNo: String?,
    val address: String?,
)
