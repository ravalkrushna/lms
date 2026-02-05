package com.example.backend.repository

import com.example.backend.dto.CreateLessonRequest
import com.example.backend.dto.LessonResponse
import com.example.backend.dto.UpdateLessonRequest
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class LessonRepository {

    private fun ResultRow.toResponse(): LessonResponse {
        return LessonResponse(
            id = this[LessonTable.id],
            sectionId = this[LessonTable.sectionId],
            title = this[LessonTable.title],
            content = this[LessonTable.content],
            videoUrl = this[LessonTable.videoUrl],
            position = this[LessonTable.position],
            isFreePreview = this[LessonTable.isFreePreview],
            createdAt = this[LessonTable.createdAt],
            updatedAt = this[LessonTable.updatedAt]
        )
    }

    fun create(sectionId: Long, req: CreateLessonRequest): LessonResponse {
        val now = Instant.now()

        val nextPosition = if (req?.position != null) {
            req.position
        } else {
            LessonTable
                .select(LessonTable.position.max())
                .where { LessonTable.sectionId eq sectionId }
                .singleOrNull()
                ?.get(LessonTable.position.max())
                ?: 0
        } + 1

        val insertedRow = LessonTable.insert {
            it[LessonTable.sectionId] = sectionId
            it[LessonTable.title] = req.title.trim()
            it[LessonTable.content] = req.content?.trim()
            it[LessonTable.videoUrl] = req.videoUrl?.trim()
            it[LessonTable.position] = nextPosition
            it[LessonTable.isFreePreview] = req.isFreePreview
            it[LessonTable.createdAt] = now
            it[LessonTable.updatedAt] = now
        }

        val newId = insertedRow[LessonTable.id]
        return getById(newId)!!
    }



    fun getById(id: Long): LessonResponse? {
        return LessonTable
            .selectAll()
            .where { LessonTable.id eq id }
            .limit(1)
            .map { it.toResponse() }
            .singleOrNull()
    }

    fun listBySection(sectionId: Long): List<LessonResponse> {
        return LessonTable
            .selectAll()
            .where { LessonTable.sectionId eq sectionId }
            .orderBy(LessonTable.position to SortOrder.ASC, LessonTable.id to SortOrder.ASC)
            .map { it.toResponse() }
    }

    fun update(id: Long, req: UpdateLessonRequest): LessonResponse? {
        val now = Instant.now()

        val updated = LessonTable.update({ LessonTable.id eq id }) {
            req.title?.let { t -> it[LessonTable.title] = t.trim() }
            req.content?.let { c -> it[LessonTable.content] = c.trim() }
            req.videoUrl?.let { v -> it[LessonTable.videoUrl] = v.trim() }
            req.position?.let { p -> it[LessonTable.position] = p }
            req.isFreePreview?.let { fp -> it[LessonTable.isFreePreview] = fp }
            it[LessonTable.updatedAt] = now
        }

        if (updated == 0) return null
        return getById(id)
    }

    fun delete(id: Long): Boolean {
        return LessonTable.deleteWhere { LessonTable.id eq id } > 0
    }

    fun findByCourse(courseId: Long): List<LessonResponse> {
        return transaction {
            (LessonTable innerJoin SectionsTable)
                .selectAll()
                .where { SectionsTable.courseId eq courseId }
                .orderBy(
                    SectionsTable.position to SortOrder.ASC,
                    LessonTable.position to SortOrder.ASC
                )
                .map { it.toResponse() }
        }
    }

    fun countByCourse(courseId: Long): Int =
        transaction {
            LessonTable
                .join(
                    SectionsTable,
                    JoinType.INNER,
                    additionalConstraint = {
                        LessonTable.sectionId eq SectionsTable.id
                    }
                )
                .selectAll().where {
                    SectionsTable.courseId eq courseId
                }
                .count()
                .toInt()
        }


    fun countBySection(sectionId: Long): Int =
        transaction {
            LessonTable
                .selectAll()
                .where { LessonTable.sectionId eq sectionId }
                .count()
                .toInt()
        }



}
