package com.example.backend.repository

import com.example.backend.dto.StudentCourseDetailResponse
import com.example.backend.dto.StudentLessonSummaryResponse
import com.example.backend.dto.StudentSectionResponse
import com.example.backend.model.CoursesTable
import com.example.backend.model.EnrollmentsTable
import com.example.backend.model.LessonProgressTable
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class StudentCourseDetailRepository {

    fun getCourseDetail(userId: Long, courseId: Long): StudentCourseDetailResponse =
        transaction {

            // 1️⃣ enrollment check
            val enrolled = EnrollmentsTable
                .selectAll()
                .where {
                    (EnrollmentsTable.userId eq userId) and
                            (EnrollmentsTable.courseId eq courseId)
                }
                .any()

            if (!enrolled) {
                throw IllegalStateException("User not enrolled in course")
            }

            // 2️⃣ course check
            val courseRow = CoursesTable
                .selectAll()
                .where {
                    (CoursesTable.id eq courseId) and
                            (CoursesTable.status eq "PUBLISHED")
                }
                .single()

            // 3️⃣ sections + lessons
            val sections = SectionsTable
                .selectAll()
                .where { SectionsTable.courseId eq courseId }
                .orderBy(SectionsTable.position)
                .map { sectionRow ->

                    val lessons =
                        (LessonTable leftJoin LessonProgressTable)
                            .selectAll()
                            .where {
                                (LessonTable.sectionId eq sectionRow[SectionsTable.id]) and
                                        ((LessonProgressTable.userId eq userId) or
                                                (LessonProgressTable.userId.isNull()))
                            }
                            .orderBy(LessonTable.position)
                            .map {
                                StudentLessonSummaryResponse(
                                    lessonId = it[LessonTable.id],
                                    title = it[LessonTable.title],
                                    completed = it[LessonProgressTable.status] == "COMPLETED"
                                )
                            }

                    StudentSectionResponse(
                        sectionId = sectionRow[SectionsTable.id],
                        title = sectionRow[SectionsTable.title],
                        lessons = lessons
                    )
                }

            StudentCourseDetailResponse(
                courseId = courseId,
                title = courseRow[CoursesTable.title],
                sections = sections
            )
        }
}
