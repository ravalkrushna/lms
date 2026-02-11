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
        if (userRepository.findByAuthId(authId) != null) {
            throw RuntimeException("Profile already exists")
        }
        userRepository.createProfile(authId, email, req)
    }

    fun getProfile(authId: Long) =
        userRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

    fun updateProfile(authId: Long, req: UserProfileRequest) =
        userRepository.updateProfile(authId, req)
}
