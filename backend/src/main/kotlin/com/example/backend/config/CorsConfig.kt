package com.example.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig(
    @Value("\${app.cors.allowedOrigin}") private val allowedOrigin: String
) {

    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration()

        val origins = allowedOrigin
            .split(",")
            .map { it.trim() }
            .filter { it.isNotBlank() }

        config.allowedOrigins = origins
        config.allowedMethods = listOf(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        )
        config.allowedHeaders = listOf("*")
        config.exposedHeaders = listOf("Set-Cookie")
        config.allowCredentials = true
        config.maxAge = 3600

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)

        return CorsFilter(source)
    }
}
