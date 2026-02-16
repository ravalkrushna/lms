package com.example.backend.service

import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.InstructorRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class AdminInstructorService(
    private val authRepository: AuthRepository,
    private val instructorRepository: InstructorRepository
) {

    fun promoteToInstructor(email: String): String {

        val normalizedEmail = email.trim().lowercase()

        transaction {

            val user = authRepository.findByEmail(normalizedEmail)
                ?: throw RuntimeException("User not found")

            if (user.role == UserRole.INSTRUCTOR.name) {
                throw RuntimeException("User already instructor")
            }

            if (instructorRepository.existsByUserId(user.id)) {
                throw RuntimeException("Instructor profile already exists")
            }


            authRepository.updateRole(normalizedEmail, UserRole.INSTRUCTOR.name)

            instructorRepository.createPromotionProfile(user.id)

        }

        return "User promoted to instructor successfully"
    }
}
