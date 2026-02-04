package com.example.backend.controller


import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class DebugController {

    @GetMapping("/debug/auth")
    fun debugAuth(): Any {
        val auth = SecurityContextHolder.getContext().authentication
        return mapOf(
            "principal" to auth?.principal.toString(),
            "name" to auth?.name,
            "authorities" to auth?.authorities?.map { it.authority },
            "isAuthenticated" to auth?.isAuthenticated
        )
    }
}
