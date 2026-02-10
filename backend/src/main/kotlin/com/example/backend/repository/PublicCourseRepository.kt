package com.example.backend.repository

import com.example.backend.dto.PublicCourseResponse
import com.example.backend.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class PublicCourseRepository {

    fun findPublishedCourses(
        search: String?,
        page: Int,
        size: Int
    ): List<PublicCourseResponse> = transaction {

        val offset = (page * size).toLong()
        val enrollCountExpr = EnrollmentsTable.id.count()

        val query = CoursesTable
            .join(UserAuthTable, JoinType.INNER, CoursesTable.instructorId, UserAuthTable.id)
            .join(EnrollmentsTable, JoinType.LEFT, CoursesTable.id, EnrollmentsTable.courseId)
            .select(
                listOf(
                    CoursesTable.id,
                    CoursesTable.title,
                    CoursesTable.description,
                    UserAuthTable.name,
                    enrollCountExpr,
                    CoursesTable.createdAt
                )
            )
            .where { CoursesTable.status eq "PUBLISHED" }

        if (!search.isNullOrBlank()) {
            query.andWhere {
                CoursesTable.title.lowerCase() like "%${search.lowercase()}%"
            }
        }

        query
            .groupBy(
                CoursesTable.id,
                CoursesTable.title,
                CoursesTable.description,
                UserAuthTable.name,
                CoursesTable.createdAt
            )
            .orderBy(CoursesTable.createdAt to SortOrder.DESC)
            .limit(size)
            .offset(offset)
            .map {
                PublicCourseResponse(
                    id = it[CoursesTable.id],
                    title = it[CoursesTable.title],
                    description = it[CoursesTable.description],
                    instructorName = it[UserAuthTable.name],
                    enrolledCount = it[enrollCountExpr],
                    createdAt = it[CoursesTable.createdAt]
                )
            }
    }
}
