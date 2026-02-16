package com.example.backend.repository

import com.example.backend.dto.*
import com.example.backend.model.InstructorsTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class InstructorRepository {

    fun createProfile(authId: Long, email: String, req: InstructorProfileRequest) = transaction {
        InstructorsTable.insert {
            it[userId] = authId
            it[name] = req.name
            it[InstructorsTable.email] = email
            it[contactNo] = req.contactNo
            it[salary] = req.salary
            it[address] = req.address
            it[designation] = req.designation
        }
    }

    fun findByAuthId(authId: Long) = transaction {
        InstructorsTable
            .selectAll()
            .where { InstructorsTable.userId eq authId }
            .map {
                InstructorProfileResponse(
                    name = it[InstructorsTable.name],
                    email = it[InstructorsTable.email],
                    contactNo = it[InstructorsTable.contactNo],
                    salary = it[InstructorsTable.salary],
                    address = it[InstructorsTable.address],
                    designation = it[InstructorsTable.designation]
                )
            }
            .singleOrNull()
    }

    fun updateProfile(authId: Long, req: UpdateInstructorRequest) = transaction {
        InstructorsTable.update({ InstructorsTable.userId eq authId }) {
            if (req.contactNo != null) it[contactNo] = req.contactNo
            if (req.address != null) it[address] = req.address
            if (req.designation != null) it[designation] = req.designation
            if (req.salary != null) it[salary] = req.salary
        }
    }

    fun updateAdminDetails(userId: Long, req: PromoteInstructorRequest) = transaction {
        InstructorsTable.update({ InstructorsTable.userId eq userId }) {
            if (req.salary != null) it[salary] = req.salary
            if (req.designation != null) it[designation] = req.designation
            if (req.contactNo != null) it[contactNo] = req.contactNo
            if (req.address != null) it[address] = req.address
        }
    }

    /* ✅ NEW METHODS — CRITICAL */

    fun existsByUserId(authId: Long) = transaction {
        InstructorsTable
            .selectAll()
            .where { InstructorsTable.userId eq authId }
            .count() > 0
    }

    fun createPromotionProfile(authId: Long, email: String) = transaction {
        InstructorsTable.insert {
            it[userId] = authId
            it[name] = "Instructor"
            it[InstructorsTable.email] = email
            it[contactNo] = null
            it[salary] = null
            it[address] = null
            it[designation] = null
        }
    }
}
