package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object UserAuthTable : Table("user_auth") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 120)
    val email = varchar("email", 160).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val role = varchar("role", 20).default(UserRole.STUDENT.name)
    val emailVerified = bool("email_verified").default(false)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at").nullable()

    override val primaryKey = PrimaryKey(id)
}

data class UserAuth(
    val id: Long,
    val name: String,
    val email: String,
    val passwordHash: String,
    val emailVerified: Boolean,
    val role: String
)