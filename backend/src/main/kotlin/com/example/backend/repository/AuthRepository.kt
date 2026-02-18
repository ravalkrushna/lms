package com.example.backend.repository

import com.example.backend.dto.UserDetailResponse
import com.example.backend.model.InstructorsTable
import com.example.backend.model.UserAuth
import com.example.backend.model.UserAuthTable
import com.example.backend.model.UserRole
import com.example.backend.model.UsersTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
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

    fun findAllUsers(): List<ResultRow> = transaction {
        UserAuthTable
            .selectAll()
            .orderBy(UserAuthTable.id, SortOrder.DESC)
            .toList()
    }


    fun findUsersByRole(role: String): List<UserAuth> = transaction {
        UserAuthTable
            .selectAll()
            .where { UserAuthTable.role eq role }
            .orderBy(UserAuthTable.id, SortOrder.DESC)
            .map {
                UserAuth(
                    id = it[UserAuthTable.id],
                    name = it[UserAuthTable.name],
                    email = it[UserAuthTable.email],
                    passwordHash = it[UserAuthTable.passwordHash],
                    emailVerified = it[UserAuthTable.emailVerified],
                    role = it[UserAuthTable.role]
                )
            }
    }

    fun findUserDetailById(userId: Long): UserDetailResponse? = transaction {

        val user = UserAuthTable
            .selectAll()
            .where { UserAuthTable.id eq userId }
            .singleOrNull() ?: return@transaction null

        val role = user[UserAuthTable.role]

        when (role) {

            UserRole.STUDENT.name -> {

                val profile = UsersTable
                    .selectAll()
                    .where { UsersTable.userId eq userId }
                    .singleOrNull()

                UserDetailResponse(
                    id = user[UserAuthTable.id],
                    name = profile?.getOrNull(UsersTable.name) ?: user[UserAuthTable.name],
                    email = profile?.getOrNull(UsersTable.email) ?: user[UserAuthTable.email],
                    role = role,
                    contactNo = profile?.getOrNull(UsersTable.contactNo),
                    address = profile?.getOrNull(UsersTable.address),
                    salary = null,
                    designation = null
                )
            }

            UserRole.INSTRUCTOR.name -> {

                val profile = InstructorsTable
                    .selectAll()
                    .where { InstructorsTable.userId eq userId }
                    .singleOrNull()

                UserDetailResponse(
                    id = user[UserAuthTable.id],
                    name = profile?.getOrNull(InstructorsTable.name) ?: user[UserAuthTable.name],
                    email = profile?.getOrNull(InstructorsTable.email) ?: user[UserAuthTable.email],
                    role = role,
                    contactNo = profile?.getOrNull(InstructorsTable.contactNo),
                    address = profile?.getOrNull(InstructorsTable.address),
                    salary = profile?.getOrNull(InstructorsTable.salary),
                    designation = profile?.getOrNull(InstructorsTable.designation)
                )
            }

            else -> {

                UserDetailResponse(
                    id = user[UserAuthTable.id],
                    name = user[UserAuthTable.name],
                    email = user[UserAuthTable.email],
                    role = role,
                    contactNo = null,
                    address = null,
                    salary = null,
                    designation = null
                )
            }
        }
    }



}