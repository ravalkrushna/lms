package com.example.backend.service

import com.example.backend.model.LessonProgressStatus
import com.example.backend.repository.LessonProgressRepository
import org.springframework.stereotype.Service

@Service
class LessonProgressService(
    private val lessonProgressRepository: LessonProgressRepository,
    private val enrollmentService: EnrollmentService
) {

    fun updateProgress(
        userId: Long,
        courseId: Long,
        lessonId: Long,
        status: LessonProgressStatus
    ) {
        if (!enrollmentService.isUserEnrolled(userId, courseId)) {
            throw IllegalStateException("User not enrolled in this course")
        }

        lessonProgressRepository.upsert(userId, lessonId, status)
    }

    fun getProgress(
        userId: Long,
        lessonId: Long
    ): LessonProgressStatus =
        lessonProgressRepository.findByUserAndLesson(userId, lessonId)
            ?: LessonProgressStatus.NOT_STARTED
}
