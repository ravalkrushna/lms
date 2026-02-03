package com.example.backend.repository

import com.example.backend.dto.CourseResponse
import com.example.backend.model.CoursesTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class CourseRepository {

    fun createCourse(title: String, description: String?, createdByUserId: Long): Long {
        return transaction {
            CoursesTable.insertAndGetId {
                it[CoursesTable.title] = title
                it[CoursesTable.description] = description
                it[CoursesTable.createdByUserId] = createdByUserId
                it[CoursesTable.isPublished] = false
            }.value
        }
    }

    fun findById(courseId: Long): CourseResponse? {
        return transaction {
            CoursesTable.selectAll()
                .where { CoursesTable.id eq courseId }
                .limit(1)
                .map { row ->
                    CourseResponse(
                        id = row[CoursesTable.id].value,
                        title = row[CoursesTable.title],
                        description = row[CoursesTable.description],
                        isPublished = row[CoursesTable.isPublished],
                        createdByUserId = row[CoursesTable.createdByUserId]
                    )
                }.singleOrNull()
        }
    }

    fun listAllPublished(): List<CourseResponse> {
        return transaction {
            CoursesTable.selectAll()
                .where { CoursesTable.isPublished eq true }
                .orderBy(CoursesTable.createdAt, SortOrder.DESC)
                .map { row ->
                    CourseResponse(
                        id = row[CoursesTable.id].value,
                        title = row[CoursesTable.title],
                        description = row[CoursesTable.description],
                        isPublished = row[CoursesTable.isPublished],
                        createdByUserId = row[CoursesTable.createdByUserId]
                    )
                }
        }
    }

    fun listMyCourses(createdByUserId: Long): List<CourseResponse> {
        return transaction {
            CoursesTable.selectAll()
                .where { CoursesTable.createdByUserId eq createdByUserId }
                .orderBy(CoursesTable.createdAt, SortOrder.DESC)
                .map { row ->
                    CourseResponse(
                        id = row[CoursesTable.id].value,
                        title = row[CoursesTable.title],
                        description = row[CoursesTable.description],
                        isPublished = row[CoursesTable.isPublished],
                        createdByUserId = row[CoursesTable.createdByUserId]
                    )
                }
        }
    }

    fun updateCourse(courseId: Long, title: String, description: String?, isPublished: Boolean): Boolean {
        return transaction {
            CoursesTable.update({ CoursesTable.id eq courseId }) {
                it[CoursesTable.title] = title
                it[CoursesTable.description] = description
                it[CoursesTable.isPublished] = isPublished
                it[CoursesTable.updatedAt] = Instant.now()
            } > 0
        }
    }

    fun deleteCourse(courseId: Long): Boolean {
        return transaction {
            CoursesTable.deleteWhere { CoursesTable.id eq courseId } > 0
        }
    }
}
