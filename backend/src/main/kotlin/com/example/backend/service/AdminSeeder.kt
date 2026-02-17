package com.example.backend.service

import com.example.backend.repository.AuthRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class AdminSeeder(
    private val authRepository: AuthRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(AdminSeeder::class.java)

    override fun run(vararg args: String) {

        if (System.getenv("SEED_ADMIN")?.lowercase() != "true") return

        val email = System.getenv("ADMIN_EMAIL")
            ?.trim()
            ?.lowercase()
            ?: error("ADMIN_EMAIL missing")

        val password = System.getenv("ADMIN_PASSWORD")
            ?: error("ADMIN_PASSWORD missing")

        val name = System.getenv("ADMIN_NAME")
            ?.trim()
            ?.ifBlank { null }
            ?: "System Admin"

        transaction {

            if (authRepository.existsByEmail(email)) {
                log.info("Admin already exists → {}", email)
                return@transaction
            }

            authRepository.createAdmin(
                name = name,
                email = email,
                passwordHash = passwordEncoder.encode(password) .toString()
            )

            log.info("Admin seeded successfully → {}", email)
        }
    }
}
