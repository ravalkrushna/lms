package com.example.backend.service

import com.example.backend.dto.UserProfileRequest
import com.example.backend.dto.UserProfileResponse
import com.example.backend.model.UsersTable
import com.example.backend.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun createProfile(authId: Long, email: String, req: UserProfileRequest) {
        userRepository.createProfile(authId, email, req)
    }

    fun getProfile(authId: Long): UserProfileResponse {
        val row = userRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

        return UserProfileResponse(
            name = row[UsersTable.name],
            email = row[UsersTable.email],
            contactNo = row[UsersTable.contactNo],
            address = row[UsersTable.address],
            collegeName = row[UsersTable.collegeName]
        )
    }
}
