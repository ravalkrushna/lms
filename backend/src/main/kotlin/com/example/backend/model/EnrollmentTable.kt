package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

object EnrollmentsTable : Table("enrollments") {

    val id = long("id").autoIncrement()

    val userId = long("user_id").index()
    val courseId = long("course_id").index()

    val status = varchar("status", 20).default("ACTIVE")

    val enrolledAt = timestamp("enrolled_at")

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex(userId, courseId)
    }
}


data class Enrollment(
    val id: Long,
    val userId: Long,
    val courseId: Long,
    val status: EnrollmentStatus,
    val enrolledAt: Instant
)