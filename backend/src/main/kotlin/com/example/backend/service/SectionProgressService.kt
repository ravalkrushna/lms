package com.example.backend.service

import com.example.backend.dto.ProgressResponse
import com.example.backend.repository.LessonProgressRepository
import com.example.backend.repository.LessonRepository
import org.springframework.stereotype.Service

@Service
class SectionProgressService(
    private val lessonRepository: LessonRepository,
    private val lessonProgressRepository: LessonProgressRepository,
    private val enrollmentService: EnrollmentService
) {

    fun getSectionProgress(
        userId: Long,
        courseId: Long,
        sectionId: Long
    ): ProgressResponse {

        // 🔐 Authorization rule: user must be enrolled in the course
        if (!enrollmentService.isUserEnrolled(userId, courseId)) {
            throw IllegalStateException("User not enrolled in this course")
        }

        // Total lessons in this section
        val totalLessons = lessonRepository.countBySection(sectionId)

        if (totalLessons == 0) {
            return ProgressResponse(
                totalLessons = 0,
                completedLessons = 0,
                percentage = 0
            )
        }

        // Completed lessons by this user in this section
        val completedLessons =
            lessonProgressRepository.countCompletedLessonsInSection(userId, sectionId)

        val percentage = (completedLessons * 100) / totalLessons

        return ProgressResponse(
            totalLessons = totalLessons,
            completedLessons = completedLessons,
            percentage = percentage
        )
    }
}
