package com.example.backend.service

import com.example.backend.model.UserAuthTable
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

    fun getUsersByRole(role: String): List<Map<String, Any>> {

        val normalizedRole = role.trim().uppercase()

        if (normalizedRole !in listOf("STUDENT", "INSTRUCTOR", "ADMIN")) {
            throw RuntimeException("Invalid role")
        }

        return authRepository.findUsersByRole(normalizedRole)
            .map {
                mapOf(
                    "id" to it.id,
                    "name" to it.name,
                    "email" to it.email,
                    "role" to it.role
                )
            }
    }


}
