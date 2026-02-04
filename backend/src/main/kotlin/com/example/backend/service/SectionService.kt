package com.example.backend.service

import com.example.backend.dto.CreateSectionRequest
import com.example.backend.dto.SectionResponse
import com.example.backend.dto.UpdateSectionRequest
import com.example.backend.model.SectionsTable
import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.SectionRepository
import com.example.backend.security.SecurityUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class SectionService(
    private val sectionRepository: SectionRepository,
    private val authRepository: AuthRepository
) {

    fun createSection(courseId: Long, req: CreateSectionRequest): SectionResponse {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            if (user.role != UserRole.INSTRUCTOR.name && user.role != UserRole.ADMIN.name) {
                throw RuntimeException("Only instructor/admin can create section")
            }

            val nextPosition = sectionRepository.getNextPosition(courseId)

            val sectionId = sectionRepository.createSection(
                courseId = courseId,
                title = req.title.trim(),
                position = nextPosition
            )

            val row = sectionRepository.findById(sectionId)
                ?: throw RuntimeException("Section not found")

            SectionResponse(
                id = row[SectionsTable.id],
                courseId = row[SectionsTable.courseId],
                title = row[SectionsTable.title],
                position = row[SectionsTable.position]
            )
        }
    }

    fun listSections(courseId: Long): List<SectionResponse> {
        return transaction {
            sectionRepository.listByCourse(courseId).map { row ->
                SectionResponse(
                    id = row[SectionsTable.id],
                    courseId = row[SectionsTable.courseId],
                    title = row[SectionsTable.title],
                    position = row[SectionsTable.position]
                )
            }
        }
    }

    fun updateSection(sectionId: Long, req: UpdateSectionRequest): SectionResponse {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            if (user.role != UserRole.INSTRUCTOR.name && user.role != UserRole.ADMIN.name) {
                throw RuntimeException("Only instructor/admin can update section")
            }

            val updated = sectionRepository.updateSection(
                sectionId = sectionId,
                title = req.title.trim()
            )

            if (updated == 0) throw RuntimeException("Section not found")

            val row = sectionRepository.findById(sectionId)
                ?: throw RuntimeException("Section not found")

            SectionResponse(
                id = row[SectionsTable.id],
                courseId = row[SectionsTable.courseId],
                title = row[SectionsTable.title],
                position = row[SectionsTable.position]
            )
        }
    }

    fun deleteSection(sectionId: Long): String {
        val email = SecurityUtils.currentEmail()

        return transaction {
            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("Unauthorized")

            if (user.role != UserRole.INSTRUCTOR.name && user.role != UserRole.ADMIN.name) {
                throw RuntimeException("Only instructor/admin can delete section")
            }

            val deleted = sectionRepository.deleteSection(sectionId)

            if (deleted == 0) throw RuntimeException("Section not found")

            "Section deleted successfully"
        }
    }

}
