package com.example.backend.repository

import com.example.backend.model.UserAuth
import com.example.backend.model.UserAuthTable
import com.example.backend.model.UserRole
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class AuthRepository {

    fun existsByEmail(email: String): Boolean {
        return !UserAuthTable
            .selectAll()
            .where { UserAuthTable.email eq email }
            .empty()
    }

    /* ================= ROLE-SAFE CREATORS ================= */

    /** ✅ Student → ALWAYS OTP */
    fun createStudent(
        name: String,
        email: String,
        passwordHash: String
    ): Long {

        val now = Instant.now()

        return UserAuthTable.insert {
            it[this.name] = name
            it[this.email] = email
            it[this.passwordHash] = passwordHash
            it[role] = UserRole.STUDENT.name
            it[emailVerified] = false    // ✅ NEVER VERIFIED
            it[createdAt] = now
            it[updatedAt] = null
        } get UserAuthTable.id
    }

    /** ✅ Instructor → ALWAYS VERIFIED */
    fun createInstructor(
        name: String,
        email: String,
        passwordHash: String
    ): Long {

        val now = Instant.now()

        return UserAuthTable.insert {
            it[this.name] = name
            it[this.email] = email
            it[this.passwordHash] = passwordHash
            it[role] = UserRole.INSTRUCTOR.name
            it[emailVerified] = true     // 🔥 PERMANENT FIX
            it[createdAt] = now
            it[updatedAt] = null
        } get UserAuthTable.id
    }

    /** ✅ Admin → ALWAYS VERIFIED */
    fun createAdmin(
        name: String,
        email: String,
        passwordHash: String
    ): Long {

        val now = Instant.now()

        return UserAuthTable.insert {
            it[this.name] = name
            it[this.email] = email
            it[this.passwordHash] = passwordHash
            it[role] = UserRole.ADMIN.name
            it[emailVerified] = true
            it[createdAt] = now
            it[updatedAt] = null
        } get UserAuthTable.id
    }

    /* ================= QUERY ================= */

    fun findByEmail(email: String): UserAuth? {
        return UserAuthTable
            .selectAll()
            .where { UserAuthTable.email eq email }
            .limit(1)
            .map { row ->
                UserAuth(
                    id = row[UserAuthTable.id],
                    name = row[UserAuthTable.name],
                    email = row[UserAuthTable.email],
                    passwordHash = row[UserAuthTable.passwordHash],
                    emailVerified = row[UserAuthTable.emailVerified],
                    role = row[UserAuthTable.role]
                )
            }
            .singleOrNull()
    }

    /* ================= MUTATIONS ================= */

    fun markEmailVerified(email: String): Int {
        return UserAuthTable.update({ UserAuthTable.email eq email }) {
            it[emailVerified] = true
            it[updatedAt] = Instant.now()
        }
    }

    fun updateRole(email: String, role: String): Int {
        return UserAuthTable.update({ UserAuthTable.email eq email }) {
            it[UserAuthTable.role] = role
            it[updatedAt] = Instant.now()
        }
    }

    fun updatePasswordHash(userId: Long, newHash: String) {
        UserAuthTable.update({ UserAuthTable.id eq userId }) {
            it[passwordHash] = newHash
            it[updatedAt] = Instant.now()
        }
    }

    fun findAllUsers(): List<ResultRow> =
        UserAuthTable
            .selectAll()
            .orderBy(UserAuthTable.id, SortOrder.DESC)
            .toList()
}
