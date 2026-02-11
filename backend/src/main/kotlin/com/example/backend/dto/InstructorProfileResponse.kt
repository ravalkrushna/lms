package com.example.backend.dto

import java.math.BigDecimal

data class InstructorProfileResponse(
    val name: String,
    val email: String,
    val contactNo: String?,
    val salary: BigDecimal?,
    val address: String?,
    val designation: String?
)

