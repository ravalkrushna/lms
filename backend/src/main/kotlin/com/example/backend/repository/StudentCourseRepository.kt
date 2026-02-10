package com.example.backend.repository

import com.example.backend.dto.StudentCourse
import com.example.backend.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class StudentCourseRepository {

    fun getStudentCourses(userId: Long): List<StudentCourse> =
        transaction {

            EnrollmentsTable
                .selectAll()
                .where { EnrollmentsTable.userId eq userId }
                .mapNotNull { enrollmentRow ->

                    val courseId = enrollmentRow[EnrollmentsTable.courseId]

                    val courseRow = CoursesTable
                        .selectAll()
                        .where {
                            (CoursesTable.id eq courseId) and
                                    (CoursesTable.status eq "PUBLISHED")
                        }
                        .singleOrNull()
                        ?: return@mapNotNull null   // ✅ SKIP DRAFT / MISSING

                    // total lessons
                    val totalLessons =
                        (LessonTable innerJoin SectionsTable)
                            .selectAll()
                            .where { SectionsTable.courseId eq courseId }
                            .count()

                    // completed lessons
                    val completedLessons =
                        (LessonProgressTable
                                innerJoin LessonTable
                                innerJoin SectionsTable)
                            .selectAll()
                            .where {
                                (LessonProgressTable.userId eq userId) and
                                        (LessonProgressTable.status eq "COMPLETED") and
                                        (SectionsTable.courseId eq courseId)
                            }
                            .count()

                    val progress =
                        if (totalLessons == 0L) 0.0
                        else (completedLessons.toDouble() / totalLessons) * 100

                    StudentCourse(
                        courseId = courseId,
                        title = courseRow[CoursesTable.title],
                        progressPercent = progress,
                        completed = progress == 100.0
                    )
                }
        }
}
