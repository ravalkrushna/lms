package com.example.backend.dto

import java.math.BigDecimal

data class UserDetailResponse(
    val id: Long,
    val name: String,
    val email: String,
    val role: String,
    val contactNo: String?,
    val address: String?,
    val salary: BigDecimal?,      // null for students
    val designation: String?      // null for students
)
