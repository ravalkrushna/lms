package com.example.backend.service

import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import org.springframework.stereotype.Service

@Service
class AdminUserService(
    private val authRepository: AuthRepository
) {

    fun updateUserRole(email: String, role: String): String {
        val normalizedEmail = email.trim().lowercase()

        val enumRole = runCatching { UserRole.valueOf(role.trim().uppercase()) }
            .getOrElse { throw RuntimeException("Invalid role. Allowed: STUDENT, INSTRUCTOR, ADMIN") }

        val updated = authRepository.updateRole(normalizedEmail, enumRole.name)
        if (updated == 0) throw RuntimeException("User not found")

        return "Role updated successfully to ${enumRole.name}"
    }
}
