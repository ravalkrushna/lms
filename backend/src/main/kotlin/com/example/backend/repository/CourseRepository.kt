package com.example.backend.repository

import com.example.backend.model.CoursesTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class CourseRepository {

    fun createCourse(
        title: String,
        description: String?,
        instructorId: Long
    ): Long {
        return (CoursesTable.insert {
            it[CoursesTable.title] = title
            it[CoursesTable.description] = description
            it[CoursesTable.instructorId] = instructorId
            it[CoursesTable.status] = "DRAFT"
            it[CoursesTable.createdAt] = Instant.now()
            it[CoursesTable.updatedAt] = Instant.now()
        } get CoursesTable.id)
    }

    fun findById(courseId: Long): ResultRow? {
        return CoursesTable
            .selectAll()
            .where { CoursesTable.id eq courseId }
            .limit(1)
            .singleOrNull()
    }

    fun publishCourse(courseId: Long): Int {
        return CoursesTable.update({ CoursesTable.id eq courseId }) {
            it[status] = "PUBLISHED"
            it[updatedAt] = Instant.now()
        }
    }

    fun listInstructorCourses(instructorId: Long): List<ResultRow> {
        return CoursesTable
            .selectAll()
            .where { CoursesTable.instructorId eq instructorId }
            .orderBy(CoursesTable.id, SortOrder.DESC)
            .toList()
    }

    fun listPublishedCourses(): List<ResultRow> {
        return CoursesTable
            .selectAll()
            .where { CoursesTable.status eq "PUBLISHED" }
            .orderBy(CoursesTable.id, SortOrder.DESC)
            .toList()
    }

    fun isInstructorOfCourse(
        instructorId: Long,
        courseId: Long
    ): Boolean =
        transaction {
            CoursesTable
                .selectAll().where{
                    (CoursesTable.id eq courseId) and
                            (CoursesTable.instructorId eq instructorId)
                }
                .limit(1)
                .any()
        }



}
