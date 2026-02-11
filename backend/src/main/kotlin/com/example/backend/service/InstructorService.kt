package com.example.backend.service

import com.example.backend.dto.InstructorProfileRequest
import com.example.backend.dto.InstructorProfileResponse
import com.example.backend.dto.PromoteInstructorRequest
import com.example.backend.dto.UpdateInstructorRequest
import com.example.backend.model.InstructorsTable
import com.example.backend.repository.InstructorRepository
import org.springframework.stereotype.Service

@Service
class InstructorService(
    private val instructorRepository: InstructorRepository
) {

    fun createProfile(authId: Long, email: String, req: InstructorProfileRequest) {
        if (instructorRepository.findByAuthId(authId) != null) {
            throw RuntimeException("Profile already exists")
        }
        instructorRepository.createProfile(authId, email, req)
    }

    fun getProfile(authId: Long) =
        instructorRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

    fun updateProfile(authId: Long, req: UpdateInstructorRequest) =
        instructorRepository.updateProfile(authId, req)

    fun updateAdmin(userId: Long, req: PromoteInstructorRequest) =
        instructorRepository.updateAdminDetails(userId, req)
}
