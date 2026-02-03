package com.example.backend.repository

import com.example.backend.model.OtpVerificationTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

data class OtpRow(
    val email: String,
    val otpHash: String,
    val expiresAt: Instant,
    val attemptsLeft: Int,
    val verified: Boolean
)

@Repository
class OtpRepository {

    fun upsertOtp(email: String, otpHash: String, expiresAt: Instant) = transaction {

        val existing = OtpVerificationTable
            .selectAll()
            .where { OtpVerificationTable.email eq email }
            .singleOrNull()

        if (existing == null) {
            OtpVerificationTable.insert {
                it[OtpVerificationTable.email] = email
                it[OtpVerificationTable.otpHash] = otpHash
                it[OtpVerificationTable.expiresAt] = expiresAt
                it[OtpVerificationTable.attemptsLeft] = 5
                it[OtpVerificationTable.verified] = false
                it[OtpVerificationTable.createdAt] = Instant.now()
            }
        } else {
            OtpVerificationTable.update({ OtpVerificationTable.email eq email }) {
                it[OtpVerificationTable.otpHash] = otpHash
                it[OtpVerificationTable.expiresAt] = expiresAt
                it[OtpVerificationTable.attemptsLeft] = 5
                it[OtpVerificationTable.verified] = false
            }
        }
    }

    fun findByEmail(email: String): OtpRow? = transaction {
        OtpVerificationTable
            .selectAll()
            .where { OtpVerificationTable.email eq email }
            .singleOrNull()
            ?.let {
                OtpRow(
                    email = it[OtpVerificationTable.email],
                    otpHash = it[OtpVerificationTable.otpHash],
                    expiresAt = it[OtpVerificationTable.expiresAt],
                    attemptsLeft = it[OtpVerificationTable.attemptsLeft],
                    verified = it[OtpVerificationTable.verified]
                )
            }
    }

    fun decrementAttempts(email: String): Int = transaction {
        val row = OtpVerificationTable
            .selectAll()
            .where { OtpVerificationTable.email eq email }
            .singleOrNull()
            ?: return@transaction 0

        val newLeft = row[OtpVerificationTable.attemptsLeft] - 1

        OtpVerificationTable.update({ OtpVerificationTable.email eq email }) {
            it[attemptsLeft] = newLeft
        }
        newLeft
    }

    fun markVerified(email: String) = transaction {
        OtpVerificationTable.update({ OtpVerificationTable.email eq email }) {
            it[verified] = true
        }
    }
}
