package com.example.backend.repository

import com.example.backend.model.UserAuth
import com.example.backend.model.UserAuthTable
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

    fun createUser(
        name: String,
        email: String,
        passwordHash: String,
        role: String
    ): Long {
        val now = Instant.now()

        return UserAuthTable.insert {
            it[UserAuthTable.name] = name
            it[UserAuthTable.email] = email
            it[UserAuthTable.passwordHash] = passwordHash
            it[UserAuthTable.role] = role
            it[UserAuthTable.emailVerified] = false
            it[UserAuthTable.createdAt] = now
            it[UserAuthTable.updatedAt] = null
        } get UserAuthTable.id
    }

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
}
