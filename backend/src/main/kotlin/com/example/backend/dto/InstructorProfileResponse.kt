package com.example.backend.dto

import java.math.BigDecimal

data class InstructorProfileResponse(
    val id: Long,              // ✅ ADD (good practice)
    val name: String,
    val email: String,
    val role: String,          // ✅ CRITICAL FIX
    val contactNo: String?,
    val address: String?,
    val salary: BigDecimal?,
    val designation: String?
)
