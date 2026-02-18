package com.example.backend.repository

import com.example.backend.dto.CourseResponse
import com.example.backend.model.Course
import com.example.backend.model.CoursesTable
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import com.example.backend.model.UserAuthTable
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

    fun listPublishedCourses(
        search: String?,
        page: Int,
        size: Int
    ): List<ResultRow> {

        val offset = (page * size).toLong()

        val query = CoursesTable
            .join(
                UserAuthTable,
                JoinType.INNER,
                CoursesTable.instructorId,
                UserAuthTable.id
            )
            .selectAll().where { CoursesTable.status eq "PUBLISHED" }

        if (!search.isNullOrBlank()) {
            query.andWhere {
                CoursesTable.title.lowerCase() like "%${search.lowercase()}%"
            }
        }

        return query
            .orderBy(CoursesTable.createdAt, SortOrder.DESC)
            .limit(size)
            .offset(offset)
            .toList()
    }


    fun findPublishedCourseDetail(courseId: Long): ResultRow? {
        return CoursesTable
            .join(
                UserAuthTable,
                JoinType.INNER,
                CoursesTable.instructorId,
                UserAuthTable.id
            )
            .join(
                SectionsTable,
                JoinType.LEFT,
                CoursesTable.id,
                SectionsTable.courseId
            )
            .join(
                LessonTable,
                JoinType.LEFT,
                SectionsTable.id,
                LessonTable.sectionId
            )
            .select(
                columns = listOf(
                    CoursesTable.id,
                    CoursesTable.title,
                    CoursesTable.description,
                    UserAuthTable.name,
                    SectionsTable.id.countDistinct(),
                    LessonTable.id.countDistinct()
                )
            )
            .where {
                (CoursesTable.id eq courseId) and
                        (CoursesTable.status eq "PUBLISHED")
            }
            .groupBy(
                CoursesTable.id,
                CoursesTable.title,
                CoursesTable.description,
                UserAuthTable.name
            )
            .singleOrNull()
    }
    fun unpublishCourse(courseId: Long): Int =
        CoursesTable.update(
            where = {
                (CoursesTable.id eq courseId) and
                        (CoursesTable.status eq "PUBLISHED")
            }
        ) {
            it[status] = "DRAFT"
            it[updatedAt] = Instant.now()
        }

    fun findPublicCurriculum(courseId: Long): List<ResultRow> {
        val lessonCountExpr = LessonTable.id.count()

        return SectionsTable
            .join(CoursesTable, JoinType.INNER, SectionsTable.courseId, CoursesTable.id)
            .join(LessonTable, JoinType.LEFT, SectionsTable.id, LessonTable.sectionId)
            .select(
                listOf(
                    SectionsTable.id,
                    SectionsTable.title,
                    lessonCountExpr
                )
            )
            .where {
                (CoursesTable.id eq courseId) and
                        (CoursesTable.status eq "PUBLISHED")
            }
            .groupBy(SectionsTable.id, SectionsTable.title)
            .orderBy(SectionsTable.position to SortOrder.ASC)
            .toList()
    }

    fun listAllCourses(): List<ResultRow> {
        return CoursesTable
            .selectAll()
            .orderBy(CoursesTable.id, SortOrder.DESC)
            .toList()
    }

    fun getPublicCurriculum(courseId: Long) = transaction {

        val sections = SectionsTable
            .selectAll()
            .where { SectionsTable.courseId eq courseId }
            .orderBy(SectionsTable.position)
            .map { sectionRow ->

                val lessons = LessonTable
                    .selectAll()
                    .where { LessonTable.sectionId eq sectionRow[SectionsTable.id] }
                    .orderBy(LessonTable.position)
                    .map { lessonRow ->

                        mapOf(
                            "lessonId" to lessonRow[LessonTable.id],
                            "title" to lessonRow[LessonTable.title]
                        )
                    }

                mapOf(
                    "sectionId" to sectionRow[SectionsTable.id],
                    "title" to sectionRow[SectionsTable.title],
                    "lessons" to lessons
                )
            }

        sections
    }

    fun findById(courseId: Long): Course? = transaction {
        CoursesTable
            .selectAll()
            .where { CoursesTable.id eq courseId }
            .map(::toCourse)
            .singleOrNull()
    }

    private fun toCourse(row: ResultRow): Course {
        return Course(
            id = row[CoursesTable.id],
            title = row[CoursesTable.title],
            description = row[CoursesTable.description],
            instructorId = row[CoursesTable.instructorId],
            status = row[CoursesTable.status]
        )
    }


}
