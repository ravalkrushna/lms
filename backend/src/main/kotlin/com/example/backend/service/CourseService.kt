package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.CourseRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CourseService(
    private val courseRepository: CourseRepository,
    private val authRepository: AuthRepository
) {

    private fun currentUserId(): Long {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw RuntimeException("Unauthorized")

        val email = authentication.name
        val user = authRepository.findByEmail(email) ?: throw RuntimeException("Unauthorized")

        return user.id
    }

    fun createCourse(req: CreateCourseRequest): CourseResponse {
        val userId = currentUserId()

        val courseId = courseRepository.createCourse(
            title = req.title.trim(),
            description = req.description?.trim(),
            createdByUserId = userId
        )

        return courseRepository.findById(courseId)!!
    }

    fun getCourse(courseId: Long): CourseResponse {
        return courseRepository.findById(courseId)
            ?: throw RuntimeException("Course not found")
    }

    fun listPublishedCourses(): List<CourseResponse> {
        return courseRepository.listAllPublished()
    }

    fun myCourses(): List<CourseResponse> {
        val userId = currentUserId()
        return courseRepository.listMyCourses(userId)
    }

    fun updateCourse(courseId: Long, req: UpdateCourseRequest): CourseResponse {
        val userId = currentUserId()

        val existing = courseRepository.findById(courseId)
            ?: throw RuntimeException("Course not found")

        if (existing.createdByUserId != userId) {
            throw RuntimeException("Forbidden: You can only update your own course")
        }

        courseRepository.updateCourse(
            courseId = courseId,
            title = req.title.trim(),
            description = req.description?.trim(),
            isPublished = req.isPublished
        )

        return courseRepository.findById(courseId)!!
    }

    fun deleteCourse(courseId: Long): String {
        val userId = currentUserId()

        val existing = courseRepository.findById(courseId)
            ?: throw RuntimeException("Course not found")

        if (existing.createdByUserId != userId) {
            throw RuntimeException("Forbidden: You can only delete your own course")
        }

        courseRepository.deleteCourse(courseId)
        return "Course deleted"
    }
}
