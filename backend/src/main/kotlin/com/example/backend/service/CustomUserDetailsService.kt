package com.example.backend.security

import com.example.backend.repository.AuthRepository
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
        val user = authRepository.findByEmail(username.lowercase().trim())
            ?: throw UsernameNotFoundException("User not found")

        return User(
            user.email,
            user.passwordHash,
            user.emailVerified, // ✅ enabled only when verified
            true,
            true,
            true,
            listOf(SimpleGrantedAuthority("ROLE_USER"))
        )
    }
}
