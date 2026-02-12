package com.example.backend.dto

data class StudentProfileResponse(
    val name: String,
    val email: String,
    val contactNo: String?,
    val address: String?
)
