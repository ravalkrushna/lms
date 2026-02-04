package com.example.backend.service

import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service

@Service
class AdminBootstrapService(
    private val authRepository: AuthRepository,

    @Value("\${app.bootstrap-admin-email:}")
    private val bootstrapAdminEmail: String
) {

    @EventListener(ApplicationReadyEvent::class)
    fun createFirstAdminIfNeeded() {
        val email = bootstrapAdminEmail.trim().lowercase()
        if (email.isBlank()) {
            println("Bootstrap admin email not configured. Skipping.")
            return
        }

        transaction {
            val user = authRepository.findByEmail(email)
                ?: run {
                    println("Bootstrap admin email not found in DB: $email")
                    return@transaction
                }

            if (user.role == UserRole.ADMIN.name) {
                println("Bootstrap admin already ADMIN: $email")
                return@transaction
            }

            authRepository.updateRole(email, UserRole.ADMIN.name)
            println("Bootstrap admin promoted to ADMIN: $email")
        }
    }
}
