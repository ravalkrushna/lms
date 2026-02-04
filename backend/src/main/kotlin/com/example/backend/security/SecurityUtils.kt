package com.example.backend.security

import org.springframework.security.core.context.SecurityContextHolder

object SecurityUtils {

    fun currentEmail(): String {
        return SecurityContextHolder.getContext().authentication?.name
            ?: throw RuntimeException("Unauthorized")
    }

    fun currentEmailOrNull(): String? {
        return SecurityContextHolder.getContext().authentication?.name
    }
}
