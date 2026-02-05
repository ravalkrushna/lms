package com.example.backend.service

import com.example.backend.dto.ProgressResponse
import com.example.backend.repository.LessonProgressRepository
import com.example.backend.repository.LessonRepository
import org.springframework.stereotype.Service

@Service
class CourseProgressService(
    private val lessonRepository: LessonRepository,
    private val lessonProgressRepository: LessonProgressRepository,
    private val enrollmentService: EnrollmentService
) {

    fun getCourseProgress(
        userId: Long,
        courseId: Long
    ): ProgressResponse {

        if (!enrollmentService.isUserEnrolled(userId, courseId)) {
            throw IllegalStateException("User not enrolled in this course")
        }

        val total = lessonRepository.countByCourse(courseId)
        if (total == 0) {
            return ProgressResponse(0, 0, 0)
        }

        val completed =
            lessonProgressRepository.countCompletedLessonsInCourse(userId, courseId)

        val percentage = (completed * 100) / total

        return ProgressResponse(
            totalLessons = total,
            completedLessons = completed,
            percentage = percentage
        )
    }
}
