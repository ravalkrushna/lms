package com.example.backend.service

import com.example.backend.dto.CourseAnalyticsResponse
import com.example.backend.dto.InstructorStudentProgress
import org.springframework.stereotype.Service

@Service
class InstructorAnalyticsService(
    private val enrollmentService: EnrollmentService,
    private val courseProgressService: CourseProgressService
) {

    fun getCourseAnalytics(
        instructorId: Long,
        courseId: Long
    ): CourseAnalyticsResponse {

        // 🔐 Instructor ownership check
        enrollmentService.requireInstructorOfCourse(instructorId, courseId)

        val students = enrollmentService.getStudentsByCourse(courseId)

        val studentProgress = students.map { (userId, email) ->
            val progress = courseProgressService
                .getCourseProgress(userId, courseId)

            InstructorStudentProgress(
                userId = userId,
                email = email,
                progressPercentage = progress.percentage
            )
        }

        val completedStudents =
            studentProgress.count { it.progressPercentage == 100 }

        return CourseAnalyticsResponse(
            totalStudents = studentProgress.size,
            completedStudents = completedStudents,
            students = studentProgress
        )
    }
}
