package com.example.backend.model

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object OtpVerificationTable : Table("otp_verifications") {
    val id = long("id").autoIncrement()
    val email = varchar("email", 160).uniqueIndex()
    val otpHash = varchar("otp_hash", 255)
    val expiresAt = timestamp("expires_at")
    val attemptsLeft = integer("attempts_left").default(5)
    val verified = bool("verified").default(false)
    val createdAt = timestamp("created_at")

    override val primaryKey = PrimaryKey(id)
}
