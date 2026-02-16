package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.repository.InstructorRepository
import org.springframework.stereotype.Service

@Service
class InstructorService(
    private val instructorRepository: InstructorRepository
) {

    fun getProfile(authId: Long) =
        instructorRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

    fun updateProfile(authId: Long, req: UpdateInstructorRequest) =
        instructorRepository.updateProfile(authId, req)

    fun getDashboardStats(authId: Long) =
        instructorRepository.getDashboardStats(authId)

}
