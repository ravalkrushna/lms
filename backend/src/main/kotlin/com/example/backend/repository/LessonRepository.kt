package com.example.backend.repository

import com.example.backend.dto.LessonResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class LessonRepository {

    object CourseLessons : Table("course_lessons") {
        val id = long("id").autoIncrement()
        val sectionId = long("section_id")
        val title = varchar("title", 200)
        val content = text("content").nullable()
        val sortOrder = integer("sort_order")
        override val primaryKey = PrimaryKey(id)
    }

    fun createLesson(sectionId: Long, title: String, content: String?, sortOrder: Int): Long = transaction {
        CourseLessons.insert {
            it[CourseLessons.sectionId] = sectionId
            it[CourseLessons.title] = title
            it[CourseLessons.content] = content
            it[CourseLessons.sortOrder] = sortOrder
        } get CourseLessons.id
    }

    fun listBySection(sectionId: Long): List<LessonResponse> = transaction {
        CourseLessons
            .selectAll()
            .where { CourseLessons.sectionId eq sectionId }
            .orderBy(CourseLessons.sortOrder to SortOrder.ASC)
            .map {
                LessonResponse(
                    id = it[CourseLessons.id],
                    sectionId = it[CourseLessons.sectionId],
                    title = it[CourseLessons.title],
                    content = it[CourseLessons.content],
                    sortOrder = it[CourseLessons.sortOrder]
                )
            }
    }

}
