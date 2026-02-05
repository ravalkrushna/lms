package com.example.backend.service

import com.example.backend.repository.EnrollmentRepository
import org.springframework.stereotype.Service

@Service
class EnrollmentService(
    private val enrollmentRepository: EnrollmentRepository
) {

    fun enroll(
        userId: Long,
        courseId: Long
    ) {
        if (enrollmentRepository.existsActive(userId, courseId)) {
            throw IllegalStateException("User already enrolled in this course")
        }

        enrollmentRepository.create(userId, courseId)
    }

    fun isUserEnrolled(
        userId: Long,
        courseId: Long
    ): Boolean =
        enrollmentRepository.existsActive(userId, courseId)
}
