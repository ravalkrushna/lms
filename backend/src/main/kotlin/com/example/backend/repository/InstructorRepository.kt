package com.example.backend.repository

import com.example.backend.dto.InstructorProfileRequest
import com.example.backend.model.InstructorsTable
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
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
            .singleOrNull()
    }
}
