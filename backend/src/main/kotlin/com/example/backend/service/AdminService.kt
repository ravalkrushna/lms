package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.model.UserAuthTable
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.InstructorRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AdminService(
    private val authRepository: AuthRepository,
    private val instructorRepository: InstructorRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun listAllUsers(): List<AdminUserResponse> =
        transaction {
            authRepository.findAllUsers().map { row ->
                AdminUserResponse(
                    id = row[UserAuthTable.id],
                    name = row[UserAuthTable.name],
                    email = row[UserAuthTable.email],
                    role = row[UserAuthTable.role]
                )
            }
        }

    fun createInstructor(req: CreateInstructorRequest) = transaction {

        val email = req.email.trim().lowercase()

        if (authRepository.existsByEmail(email)) {
            error("Instructor already exists")
        }

        val passwordHash: String = passwordEncoder.encode(req.password).toString()

        val userId = authRepository.createInstructor(
            name = req.name.trim(),
            email = email,
            passwordHash = passwordHash
        )

        instructorRepository.createInstructorProfile(userId, req)
    }
}
