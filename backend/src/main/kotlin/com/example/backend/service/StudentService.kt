package com.example.backend.service

import com.example.backend.dto.StudentProfileResponse
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.UserRepository
import com.example.backend.security.SecurityUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class StudentService (
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository
){

    fun getStudentProfile(): StudentProfileResponse {

        val email = SecurityUtils.currentEmailOrNull()
            ?: throw RuntimeException("Not authenticated")

        return transaction {

            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("User not found")

            val profile = userRepository.findByAuthId(user.id)

            StudentProfileResponse(
                name = user.name,
                email = user.email,
                contactNo = profile?.contactNo,
                address = profile?.address
            )
        }
    }

}