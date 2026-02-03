package com.example.backend.service

import com.example.backend.dto.CreateLessonRequest
import com.example.backend.dto.LessonResponse
import com.example.backend.repository.LessonRepository
import org.springframework.stereotype.Service

@Service
class LessonService(
    private val lessonRepository: LessonRepository,
    private val authService: AuthService
) {

    fun createLesson(sectionId: Long, req: CreateLessonRequest): LessonResponse {
        authService.getSessionInfo() ?: throw RuntimeException("Unauthorized")

        val id = lessonRepository.createLesson(
            sectionId = sectionId,
            title = req.title.trim(),
            content = req.content?.trim(),
            sortOrder = req.sortOrder
        )

        return LessonResponse(
            id = id,
            sectionId = sectionId,
            title = req.title.trim(),
            content = req.content?.trim(),
            sortOrder = req.sortOrder
        )
    }

    fun listLessons(sectionId: Long): List<LessonResponse> {
        authService.getSessionInfo() ?: throw RuntimeException("Unauthorized")
        return lessonRepository.listBySection(sectionId)
    }
}
