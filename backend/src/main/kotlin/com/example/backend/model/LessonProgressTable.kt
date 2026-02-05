package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object LessonProgressTable : Table("lesson_progress") {

    val id = long("id").autoIncrement()

    val userId = long("user_id").index()
    val lessonId = long("lesson_id").index()

    val status = varchar("status", 20)
    val lastAccessedAt = timestamp("last_accessed_at")

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(userId, lessonId)
    }
}
