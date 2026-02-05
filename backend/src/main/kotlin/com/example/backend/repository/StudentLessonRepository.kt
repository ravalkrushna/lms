package com.example.backend.repository

import com.example.backend.dto.StudentLessonResponse
import com.example.backend.model.CoursesTable
import com.example.backend.model.EnrollmentsTable
import com.example.backend.model.LessonProgressTable
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import org.jetbrains.exposed.sql.JoinType
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class StudentLessonRepository {

    fun getLesson(userId: Long, lessonId: Long): StudentLessonResponse =
        transaction {

            val lessonRow =
                LessonTable
                    .join(
                        SectionsTable,
                        JoinType.INNER,
                        LessonTable.sectionId,
                        SectionsTable.id
                    )
                    .join(
                        CoursesTable,
                        JoinType.INNER,
                        SectionsTable.courseId,
                        CoursesTable.id
                    )
                    .selectAll()
                    .where {
                        (LessonTable.id eq lessonId) and
                                (CoursesTable.status eq "PUBLISHED")
                    }
                    .singleOrNull()
                    ?: throw IllegalStateException("Lesson not found or not published")

            val enrolled = EnrollmentsTable
                .selectAll()
                .where {
                    (EnrollmentsTable.userId eq userId) and
                            (EnrollmentsTable.courseId eq lessonRow[CoursesTable.id])
                }
                .any()

            if (!enrolled) {
                throw IllegalStateException("User not enrolled in this course")
            }

            val progressStatus = LessonProgressTable
                .selectAll()
                .where {
                    (LessonProgressTable.userId eq userId) and
                            (LessonProgressTable.lessonId eq lessonId)
                }
                .singleOrNull()
                ?.get(LessonProgressTable.status)

            StudentLessonResponse(
                lessonId = lessonRow[LessonTable.id],
                title = lessonRow[LessonTable.title],
                content = lessonRow[LessonTable.content],
                videoUrl = lessonRow[LessonTable.videoUrl],
                completed = progressStatus == "COMPLETED"
            )
        }
}
