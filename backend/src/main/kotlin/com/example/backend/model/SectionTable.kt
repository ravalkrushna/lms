package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object SectionsTable : Table("sections") {
    val id = long("id").autoIncrement()

    val courseId = long("course_id")
    val title = varchar("title", 200)
    val position = integer("position")

    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)
}
