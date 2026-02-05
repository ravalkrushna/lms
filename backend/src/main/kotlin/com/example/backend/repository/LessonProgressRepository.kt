package com.example.backend.repository

import com.example.backend.model.LessonProgressStatus
import com.example.backend.model.LessonProgressTable
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class LessonProgressRepository {

    fun upsert(
        userId: Long,
        lessonId: Long,
        status: LessonProgressStatus
    ) {
        transaction {
            val updated = LessonProgressTable.update(
                { (LessonProgressTable.userId eq userId) and (LessonProgressTable.lessonId eq lessonId) }
            ) {
                it[this.status] = status.name
                it[this.lastAccessedAt] = Instant.now()
            }

            if (updated == 0) {
                LessonProgressTable.insert {
                    it[this.userId] = userId
                    it[this.lessonId] = lessonId
                    it[this.status] = status.name
                    it[this.lastAccessedAt] = Instant.now()
                }
            }
        }
    }

    fun findByUserAndLesson(
        userId: Long,
        lessonId: Long
    ): LessonProgressStatus? =
        transaction {
            LessonProgressTable
                .selectAll()
                .where {
                    (LessonProgressTable.userId eq userId) and
                            (LessonProgressTable.lessonId eq lessonId)
                }
                .limit(1)
                .map { LessonProgressStatus.valueOf(it[LessonProgressTable.status]) }
                .singleOrNull()
        }

    fun countCompletedLessonsInCourse(
        userId: Long,
        courseId: Long
    ): Int =
        transaction {
            LessonProgressTable
                .join(
                    LessonTable,
                    JoinType.INNER,
                    additionalConstraint = {
                        LessonProgressTable.lessonId eq LessonTable.id
                    }
                )
                .join(
                    SectionsTable,
                    JoinType.INNER,
                    additionalConstraint = {
                        LessonTable.sectionId eq SectionsTable.id
                    }
                )
                .selectAll().where {
                    (LessonProgressTable.userId eq userId) and
                            (LessonProgressTable.status eq "COMPLETED") and
                            (SectionsTable.courseId eq courseId)
                }
                .count()
                .toInt()
        }


    fun countCompletedLessonsInSection(
        userId: Long,
        sectionId: Long
    ): Int =
        transaction {
            (LessonProgressTable
                .join(
                    LessonTable,
                    JoinType.INNER,
                    additionalConstraint = {
                        LessonProgressTable.lessonId eq LessonTable.id
                    }
                ))
                .selectAll().where {
                    (LessonProgressTable.userId eq userId) and
                            (LessonProgressTable.status eq "COMPLETED") and
                            (LessonTable.sectionId eq sectionId)
                }
                .count()
                .toInt()
        }

}
