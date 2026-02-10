package com.example.backend.service

import com.example.backend.dto.PublicSectionPreviewResponse
import com.example.backend.model.*
import com.example.backend.repository.CourseRepository
import org.jetbrains.exposed.sql.count
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class PublicCurriculumService(
    private val courseRepository: CourseRepository
) {

    fun getCurriculum(courseId: Long): List<PublicSectionPreviewResponse> =
        transaction {
            val lessonCountExpr = LessonTable.id.count()

            courseRepository.findPublicCurriculum(courseId)
                .map {
                    PublicSectionPreviewResponse(
                        sectionId = it[SectionsTable.id],
                        title = it[SectionsTable.title],
                        lessonCount = it[lessonCountExpr].toInt()
                    )
                }
        }
}
