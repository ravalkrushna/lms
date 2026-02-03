package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object UserAuthTable : Table("user_auth") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 120)
    val email = varchar("email", 160).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val emailVerified = bool("email_verified").default(false)
    val createdAt = timestamp("created_at")

    override val primaryKey = PrimaryKey(id)
}
