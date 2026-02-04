package com.example.backend.service

import com.example.backend.dto.CreateLessonRequest
import com.example.backend.dto.LessonResponse
import com.example.backend.dto.UpdateLessonRequest
import com.example.backend.repository.LessonRepository
import com.example.backend.repository.SectionRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class LessonService(
    private val lessonRepository: LessonRepository,
    private val sectionRepository: SectionRepository
) {

    private fun validateCreate(req: CreateLessonRequest) {
        if (req.title.isBlank()) throw IllegalArgumentException("Title is required")

        val hasContent = !req.content.isNullOrBlank()
        val hasVideo = !req.videoUrl.isNullOrBlank()

        if (!hasContent && !hasVideo) {
            throw IllegalArgumentException("Either content or videoUrl is required")
        }
    }

    fun create(sectionId: Long, req: CreateLessonRequest): LessonResponse {
        validateCreate(req)

        return transaction {
            if (!sectionRepository.existsById(sectionId)) {
                throw IllegalArgumentException("Section not found")
            }
            lessonRepository.create(sectionId, req)
        }
    }

    fun listBySection(sectionId: Long): List<LessonResponse> {
        return transaction {
            if (!sectionRepository.existsById(sectionId)) {
                throw IllegalArgumentException("Section not found")
            }
            lessonRepository.listBySection(sectionId)
        }
    }

    fun getById(lessonId: Long): LessonResponse {
        return transaction {
            lessonRepository.getById(lessonId)
                ?: throw IllegalArgumentException("Lesson not found")
        }
    }

    fun update(lessonId: Long, req: UpdateLessonRequest): LessonResponse {
        return transaction {
            lessonRepository.update(lessonId, req)
                ?: throw IllegalArgumentException("Lesson not found")
        }
    }

    fun delete(lessonId: Long) {
        transaction {
            val ok = lessonRepository.delete(lessonId)
            if (!ok) throw IllegalArgumentException("Lesson not found")
        }
    }
}
