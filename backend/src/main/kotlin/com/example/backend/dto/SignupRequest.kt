package com.example.backend.dto


data class SignupRequest(
    val name: String,
    val email: String,
    val password: String,
    val contactNo: String,
    val address: String
)
