package com.example.backend.service

import com.example.backend.dto.AdminUserResponse
import com.example.backend.model.UserAuthTable
import com.example.backend.repository.AuthRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class AdminService(
    private val authRepository: AuthRepository
) {

    fun listAllUsers(): List<AdminUserResponse> =
        transaction {
            authRepository.findAllUsers().map { row ->
                AdminUserResponse(
                    id = row[UserAuthTable.id],
                    name = row[UserAuthTable.name],
                    email = row[UserAuthTable.email],
                    role = row[UserAuthTable.role]
                )
            }
        }

}