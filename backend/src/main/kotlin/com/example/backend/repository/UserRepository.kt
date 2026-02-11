package com.example.backend.repository

import com.example.backend.dto.UserProfileRequest
import com.example.backend.dto.UserProfileResponse
import com.example.backend.model.UsersTable
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.update
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
            .selectAll().where { UsersTable.userId eq authId }
            .map {
                UserProfileResponse(
                    name = it[UsersTable.name],
                    email = it[UsersTable.email],
                    contactNo = it[UsersTable.contactNo],
                    address = it[UsersTable.address],
                    collegeName = it[UsersTable.collegeName]
                )
            }.singleOrNull()
    }

    fun updateProfile(authId: Long, req: UserProfileRequest) = transaction {
        UsersTable.update({ UsersTable.userId eq authId }) {
            it[name] = req.name
            it[contactNo] = req.contactNo
            it[address] = req.address
            it[collegeName] = req.collegeName
        }
    }
}
