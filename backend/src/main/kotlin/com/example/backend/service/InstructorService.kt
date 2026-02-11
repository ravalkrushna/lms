package com.example.backend.service

import com.example.backend.dto.InstructorProfileRequest
import com.example.backend.dto.InstructorProfileResponse
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

    fun getProfile(authId: Long): InstructorProfileResponse {

        val row = instructorRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

        return InstructorProfileResponse(
            name = row[InstructorsTable.name],
            email = row[InstructorsTable.email],
            contactNo = row[InstructorsTable.contactNo],
            salary = row[InstructorsTable.salary],
            address = row[InstructorsTable.address],
            designation = row[InstructorsTable.designation]
        )
    }
}
