package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object LessonTable : Table("lessons") {

    val id = long("id").autoIncrement()

    val sectionId = long("section_id")
    val title = varchar("title", 255)

    val content = text("content").nullable()
    val videoUrl = varchar("video_url", 1024).nullable()

    val position = integer("position").default(0)
    val isFreePreview = bool("is_free_preview").default(false)

    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)

    init {
        index(true, sectionId, position) // unique ordering in a section
        index(false, sectionId)
    }
}
