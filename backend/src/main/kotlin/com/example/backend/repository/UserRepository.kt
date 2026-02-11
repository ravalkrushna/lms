package com.example.backend.repository

import com.example.backend.dto.UserProfileRequest
import com.example.backend.model.UsersTable
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class UserRepository {

    fun createProfile(authId: Long, email: String, req: UserProfileRequest) = transaction {
        UsersTable.insert {
            it[userId] = authId
            it[name] = req.name
            it[UsersTable.email] = email
            it[contactNo] = req.contactNo
            it[address] = req.address
            it[collegeName] = req.collegeName
        }
    }

    fun findByAuthId(authId: Long) = transaction {
        UsersTable
            .selectAll()
            .where { UsersTable.userId eq authId }
            .singleOrNull()
    }
}
