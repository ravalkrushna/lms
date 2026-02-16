package com.example.backend.repository

import com.example.backend.dto.*
import com.example.backend.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class InstructorRepository {

    /* ✅ Fetch Profile (JOIN USERS + INSTRUCTORS) */
    fun findByAuthId(authId: Long) = transaction {

        UsersTable
            .join(
                InstructorsTable,
                JoinType.INNER,
                onColumn = UsersTable.userId,
                otherColumn = InstructorsTable.userId
            )
            .selectAll()
            .where { UsersTable.userId eq authId }
            .map {

                InstructorProfileResponse(
                    name = it[UsersTable.name],
                    email = it[UsersTable.email],
                    contactNo = it[UsersTable.contactNo],
                    address = it[UsersTable.address],
                    salary = it[InstructorsTable.salary],
                    designation = it[InstructorsTable.designation]
                )
            }
            .singleOrNull()
    }


    /* ✅ Update Profile (Split Correctly) */
    fun updateProfile(authId: Long, req: UpdateInstructorRequest) = transaction {

        /* USERS table → identity data */
        UsersTable.update({ UsersTable.userId eq authId }) {

            req.contactNo?.let { value -> it[contactNo] = value }
            req.address?.let { value -> it[address] = value }
        }

        /* INSTRUCTORS table → role data */
        InstructorsTable.update({ InstructorsTable.userId eq authId }) {

            req.salary?.let { value -> it[salary] = value }
            req.designation?.let { value -> it[designation] = value }
        }
    }

    /* ✅ Promotion Profile */
    fun createPromotionProfile(authId: Long) = transaction {

        InstructorsTable.insert {
            it[userId] = authId
            it[salary] = null
            it[designation] = null
        }
    }

    fun existsByUserId(authId: Long) = transaction {
        InstructorsTable
            .selectAll()
            .where { InstructorsTable.userId eq authId }
            .count() > 0
    }
}
