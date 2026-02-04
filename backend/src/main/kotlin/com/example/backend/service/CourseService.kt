package com.example.backend.service

import com.example.backend.dto.CourseResponse
import com.example.backend.dto.CreateCourseRequest
import com.example.backend.model.CoursesTable
import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.CourseRepository
import com.example.backend.security.SecurityUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class CourseService(
    private val courseRepository: CourseRepository,
    private val authRepository: AuthRepository
) {

    fun createCourse(req: CreateCourseRequest): CourseResponse {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            if (user.role != UserRole.INSTRUCTOR.name && user.role != UserRole.ADMIN.name) {
                throw RuntimeException("Only instructor/admin can create course")
            }

            val courseId = courseRepository.createCourse(
                title = req.title.trim(),
                description = req.description?.trim(),
                instructorId = user.id
            )

            val row = courseRepository.findById(courseId)
                ?: throw RuntimeException("Course not found")

            CourseResponse(
                id = row[CoursesTable.id],
                title = row[CoursesTable.title],
                description = row[CoursesTable.description],
                instructorId = row[CoursesTable.instructorId],
                status = row[CoursesTable.status]
            )
        }
    }

    fun publishCourse(courseId: Long): String {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            if (user.role != UserRole.INSTRUCTOR.name && user.role != UserRole.ADMIN.name) {
                throw RuntimeException("Only instructor/admin can publish course")
            }

            val updated = courseRepository.publishCourse(courseId)
            if (updated == 0) throw RuntimeException("Course not found")

            "Course published successfully"
        }
    }

    fun listMyCourses(): List<CourseResponse> {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            courseRepository.listInstructorCourses(user.id).map { row ->
                CourseResponse(
                    id = row[CoursesTable.id],
                    title = row[CoursesTable.title],
                    description = row[CoursesTable.description],
                    instructorId = row[CoursesTable.instructorId],
                    status = row[CoursesTable.status]
                )
            }
        }
    }

    fun listPublishedCourses(): List<CourseResponse> {
        return transaction {
            courseRepository.listPublishedCourses().map { row ->
                CourseResponse(
                    id = row[CoursesTable.id],
                    title = row[CoursesTable.title],
                    description = row[CoursesTable.description],
                    instructorId = row[CoursesTable.instructorId],
                    status = row[CoursesTable.status]
                )
            }
        }
    }
}
