package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.repository.CourseRepository
import com.example.backend.repository.InstructorRepository
import org.springframework.stereotype.Service

@Service
class InstructorService(
    private val instructorRepository: InstructorRepository,
    private val courseRepository: CourseRepository
) {

    fun getProfile(authId: Long) =
        instructorRepository.findByAuthId(authId)
            ?: throw RuntimeException("Profile not found")

    fun updateProfile(authId: Long, req: UpdateInstructorRequest) =
        instructorRepository.updateProfile(authId, req)

    fun getDashboardStats(authId: Long) =
        instructorRepository.getDashboardStats(authId)

    fun getCourseById(courseId: Long): CourseResponse {

        val course = courseRepository.findById(courseId)
            ?: throw RuntimeException("Course not found")

        return CourseResponse(
            id = course.id,
            title = course.title,
            description = course.description,
            instructorId = course.instructorId,
            status = course.status
        )
    }

}
