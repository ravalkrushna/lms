package com.example.backend.utils

import com.example.backend.service.EnrollmentService
import org.springframework.security.access.AccessDeniedException

object EnrollmentGuard {

    fun requireEnrollment(
        enrollmentService: EnrollmentService,
        userId: Long,
        courseId: Long
    ) {
        val enrolled = enrollmentService.isUserEnrolled(userId, courseId)

        if (!enrolled) {
            throw AccessDeniedException("You are not enrolled in this course")
        }
    }
}
