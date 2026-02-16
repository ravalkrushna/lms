package com.example.backend.dto

import java.math.BigDecimal

data class PromoteInstructorRequest(
    val userId: Long,
    val salary: BigDecimal?,
    val designation: String?,
    val contactNo: String?,
    val address: String?
)

data class UpdateInstructorRequest(
    val contactNo: String?,
    val address: String?,
    val designation: String?,
    val salary: BigDecimal?
)
