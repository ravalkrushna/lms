package com.example.backend.repository

import com.example.backend.model.SectionsTable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class SectionRepository {

    fun getNextPosition(courseId: Long): Int {
        return transaction {
            val maxPos: Int? = SectionsTable
                .selectAll()
                .where { SectionsTable.courseId eq courseId }
                .maxOfOrNull { it[SectionsTable.position] }

            (maxPos ?: 0) + 1
        }
    }

    fun createSection(courseId: Long, title: String, position: Int): Long {
        val now = Instant.now()

        return SectionsTable.insert {
            it[SectionsTable.courseId] = courseId
            it[SectionsTable.title] = title
            it[SectionsTable.position] = position
            it[SectionsTable.createdAt] = now
            it[SectionsTable.updatedAt] = now
        } get SectionsTable.id
    }


    fun findById(sectionId: Long) = transaction {
        SectionsTable
            .selectAll()
            .where { SectionsTable.id eq sectionId }
            .limit(1)
            .singleOrNull()
    }

    fun listByCourse(courseId: Long) = transaction {
        SectionsTable
            .selectAll()
            .where { SectionsTable.courseId eq courseId }
            .orderBy(SectionsTable.position to SortOrder.ASC)
            .toList()
    }

    fun updateSection(sectionId: Long, title: String): Int {
        val now = Instant.now()

        return SectionsTable.update({ SectionsTable.id eq sectionId }) {
            it[SectionsTable.title] = title
            it[SectionsTable.updatedAt] = now
        }
    }


    fun deleteSection(sectionId: Long): Int {
        return transaction {
            SectionsTable.deleteWhere { SectionsTable.id eq sectionId }
        }
    }
}
