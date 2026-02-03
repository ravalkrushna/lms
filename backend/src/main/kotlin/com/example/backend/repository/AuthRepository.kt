package com.example.backend.repository

import com.example.backend.model.UserAuthTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

data class UserAuthRow(
    val id: Long,
    val name: String,
    val email: String,
    val passwordHash: String,
    val emailVerified: Boolean
)

@Repository
class AuthRepository {

    fun existsByEmail(email: String): Boolean = transaction {
        UserAuthTable
            .selectAll()
            .where { UserAuthTable.email eq email }
            .count() > 0
    }

    fun createUser(name: String, email: String, passwordHash: String): Long = transaction {
        UserAuthTable.insert {
            it[UserAuthTable.name] = name
            it[UserAuthTable.email] = email
            it[UserAuthTable.passwordHash] = passwordHash
            it[UserAuthTable.emailVerified] = false
            it[UserAuthTable.createdAt] = Instant.now()
        } get UserAuthTable.id
    }

    fun findByEmail(email: String): UserAuthRow? = transaction {
        UserAuthTable
            .selectAll()
            .where { UserAuthTable.email eq email }
            .singleOrNull()
            ?.let {
                UserAuthRow(
                    id = it[UserAuthTable.id],
                    name = it[UserAuthTable.name],
                    email = it[UserAuthTable.email],
                    passwordHash = it[UserAuthTable.passwordHash],
                    emailVerified = it[UserAuthTable.emailVerified]
                )
            }
    }

    fun markEmailVerified(email: String) = transaction {
        UserAuthTable.update({ UserAuthTable.email eq email }) {
            it[emailVerified] = true
        }
    }
}
