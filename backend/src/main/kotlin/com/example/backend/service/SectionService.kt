package com.example.backend.service

import com.example.backend.dto.CreateSectionRequest
import com.example.backend.dto.SectionResponse
import com.example.backend.repository.SectionRepository
import org.springframework.stereotype.Service

@Service
class SectionService(
    private val sectionRepository: SectionRepository,
    private val authService: AuthService
) {

    fun createSection(courseId: Long, req: CreateSectionRequest): SectionResponse {
        authService.getSessionInfo() ?: throw RuntimeException("Unauthorized")

        val id = sectionRepository.createSection(
            courseId = courseId,
            title = req.title.trim(),
            sortOrder = req.sortOrder
        )

        return SectionResponse(
            id = id,
            courseId = courseId,
            title = req.title.trim(),
            sortOrder = req.sortOrder
        )
    }

    fun listSections(courseId: Long): List<SectionResponse> {
        authService.getSessionInfo() ?: throw RuntimeException("Unauthorized")
        return sectionRepository.listByCourse(courseId)
    }
}
