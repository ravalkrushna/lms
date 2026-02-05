package com.example.backend.service

import com.example.backend.repository.AuthRepository
import com.example.backend.security.CustomUserPrincipal
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.core.authority.SimpleGrantedAuthority
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

        val role = user.role.uppercase()

        return CustomUserPrincipal(
            id = user.id,
            email = user.email,
            password = user.passwordHash,
            authorities = listOf(SimpleGrantedAuthority("ROLE_$role"))
        )
    }
}
