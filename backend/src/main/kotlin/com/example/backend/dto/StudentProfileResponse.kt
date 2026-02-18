package com.example.backend.dto

data class StudentProfileResponse(
    val id: Long,
    val name: String,
    val email: String,
    val contactNo: String?,
    val address: String?,
)
