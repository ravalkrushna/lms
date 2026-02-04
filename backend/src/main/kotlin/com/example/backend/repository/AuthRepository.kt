package com.example.backend.repository

import com.example.backend.model.UserAuth
import com.example.backend.model.UserAuthTable
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.update
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class AuthRepository {

    fun existsByEmail(email: String): Boolean {
        return UserAuthTable
            .selectAll()
            .where { UserAuthTable.email eq email }
            .limit(1)
            .count() > 0
    }

    fun createUser(
        name: String,
        email: String,
        passwordHash: String,
        role: String
    ): Long {
        return UserAuthTable.insert {
            it[UserAuthTable.name] = name
            it[UserAuthTable.email] = email
            it[UserAuthTable.passwordHash] = passwordHash
            it[UserAuthTable.role] = role
            it[UserAuthTable.emailVerified] = false
            it[UserAuthTable.createdAt] = Instant.now()
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
        }
    }

    fun updateRole(email: String, role: String): Int {
        return UserAuthTable.update({ UserAuthTable.email eq email }) {
            it[UserAuthTable.role] = role
        }
    }
}
