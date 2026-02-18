package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object CoursesTable : Table("courses") {
    val id = long("id").autoIncrement()

    val title = varchar("title", 200)
    val description = text("description").nullable()

    val instructorId = long("instructor_id")

    val status = varchar("status", 20).default("DRAFT")

    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)
}

data class Course(
    val id: Long,
    val title: String,
    val description: String?,
    val instructorId: Long,
    val status: String
)
