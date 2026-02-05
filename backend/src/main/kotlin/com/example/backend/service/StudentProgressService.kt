package com.example.backend.service

import com.example.backend.model.LessonProgressTable
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.and


@Service
class StudentProgressService {

    fun completeLesson(userId: Long, lessonId: Long) =
        transaction{

            LessonProgressTable.insertIgnore {
                it[this.userId] = userId
                it[this.lessonId] = lessonId
                it[this.status] = "COMPLETED"
                it[this.lastAccessedAt] = java.time.Instant.now()
            }

            LessonProgressTable.update(
                {
                    (LessonProgressTable.userId eq userId) and
                            (LessonProgressTable.lessonId eq lessonId)
                }
            ) {
                it[status] = "COMPLETED"
                it[lastAccessedAt] = java.time.Instant.now()
            }
        }
}
