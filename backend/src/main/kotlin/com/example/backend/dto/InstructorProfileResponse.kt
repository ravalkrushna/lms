package com.example.backend.dto

import java.math.BigDecimal

data class InstructorProfileResponse(
    val name: String,
    val email: String,
    val contactNo: String?,
    val address: String?,
    val salary: BigDecimal?,
    val designation: String?
)

