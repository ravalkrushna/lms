package com.example.backend.service

import com.example.backend.model.CoursesTable
import com.example.backend.repository.CourseRepository
import com.example.backend.repository.EnrollmentRepository
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service


@Service
class EnrollmentService(
    private val enrollmentRepository: EnrollmentRepository,
    private val courseRepository: CourseRepository
) {

     fun enroll(userId: Long, courseId: Long) = transaction {

        /* ✅ Course must exist & be published */
        val validCourse = CoursesTable
            .selectAll()
            .where {
                (CoursesTable.id eq courseId) and
                        (CoursesTable.status eq "PUBLISHED")
            }
            .any()

        if (!validCourse) {
            throw IllegalStateException("Course not available")
        }

        /* ✅ Prevent duplicate enrollment */
        if (enrollmentRepository.existsActive(userId, courseId)) {
            return@transaction
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
