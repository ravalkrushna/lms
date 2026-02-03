package com.example.backend.model

import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

object CoursesTable : LongIdTable("courses") {
    val title = varchar("title", 150)
    val description = varchar("description", 1000).nullable()

    val createdByUserId = long("created_by_user_id")

    val isPublished = bool("is_published").default(false)

    val createdAt = timestamp("created_at").clientDefault { Instant.now() }
    val updatedAt = timestamp("updated_at").clientDefault { Instant.now() }
}
