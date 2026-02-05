package com.example.backend.service

import com.example.backend.repository.CourseRepository
import com.example.backend.repository.EnrollmentRepository
import org.springframework.stereotype.Service


@Service
class EnrollmentService(
    private val enrollmentRepository: EnrollmentRepository,
    private val courseRepository: CourseRepository
) {

    fun enroll(userId: Long, courseId: Long) {
        if (enrollmentRepository.existsActive(userId, courseId)) {
            throw IllegalStateException("User already enrolled in this course")
        }
        enrollmentRepository.create(userId, courseId)
    }

    fun isUserEnrolled(userId: Long, courseId: Long): Boolean =
        enrollmentRepository.existsActive(userId, courseId)

    fun getStudentsByCourse(courseId: Long): List<Pair<Long, String>> =
        enrollmentRepository.findStudentsByCourse(courseId)

    fun isInstructorOfCourse(
        instructorId: Long,
        courseId: Long
    ): Boolean =
        courseRepository.isInstructorOfCourse(instructorId, courseId)

    fun requireInstructorOfCourse(
        instructorId: Long,
        courseId: Long
    ) {
        if (!isInstructorOfCourse(instructorId, courseId)) {
            throw IllegalStateException("Not instructor of this course")
        }
    }
}
