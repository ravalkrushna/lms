package com.example.backend.service

import com.example.backend.dto.ChangePasswordRequest
import com.example.backend.repository.AuthRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class PasswordService(
    private val authRepository: AuthRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun changePassword(req: ChangePasswordRequest) {

        if (req.newPassword != req.confirmNewPassword) {
            throw IllegalArgumentException("New password and confirm password do not match")
        }

        if (req.newPassword.length < 8) {
            throw IllegalArgumentException("Password must be at least 8 characters")
        }

        val auth = SecurityContextHolder.getContext().authentication
            ?: throw IllegalArgumentException("Unauthenticated")

        val email = auth.name.trim().lowercase()

        transaction {
            val user = authRepository.findByEmail(email)
                ?: throw IllegalArgumentException("User not found")

            val oldOk = passwordEncoder.matches(req.oldPassword, user.passwordHash)
            if (!oldOk) throw IllegalArgumentException("Old password is incorrect")

            val newHash = passwordEncoder.encode(req.newPassword)
                ?: throw IllegalStateException("Failed to encode password")

            authRepository.updatePasswordHash(user.id, newHash)
        }
    }
}
