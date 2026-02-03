package com.example.backend.repository

import com.example.backend.dto.SectionResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class SectionRepository {

    object CourseSections : Table("course_sections") {
        val id = long("id").autoIncrement()
        val courseId = long("course_id")
        val title = varchar("title", 200)
        val sortOrder = integer("sort_order")
        override val primaryKey = PrimaryKey(id)
    }

    fun createSection(courseId: Long, title: String, sortOrder: Int): Long = transaction {
        CourseSections.insert {
            it[CourseSections.courseId] = courseId
            it[CourseSections.title] = title
            it[CourseSections.sortOrder] = sortOrder
        } get CourseSections.id
    }

    fun listByCourse(courseId: Long): List<SectionResponse> = transaction {
        CourseSections
            .selectAll()
            .where { CourseSections.courseId eq courseId }
            .orderBy(CourseSections.sortOrder to SortOrder.ASC)
            .map {
                SectionResponse(
                    id = it[CourseSections.id],
                    courseId = it[CourseSections.courseId],
                    title = it[CourseSections.title],
                    sortOrder = it[CourseSections.sortOrder]
                )
            }
    }
}
