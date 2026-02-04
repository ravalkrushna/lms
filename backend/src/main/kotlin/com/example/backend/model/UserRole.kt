package com.example.backend.model

enum class UserRole {
    STUDENT,
    INSTRUCTOR,
    ADMIN;

    fun asAuthority(): String = "ROLE_$name"
}