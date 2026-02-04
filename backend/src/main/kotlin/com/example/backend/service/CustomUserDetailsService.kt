package com.example.backend.service

import com.example.backend.repository.AuthRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val authRepository: AuthRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val email = username.trim().lowercase()

        val user = transaction {
            authRepository.findByEmail(email)
        } ?: throw UsernameNotFoundException("User not found")

        val role = user.role.uppercase() // STUDENT / INSTRUCTOR / ADMIN

        return User(
            user.email,
            user.passwordHash,
            listOf(SimpleGrantedAuthority("ROLE_$role"))
        )
    }
}
