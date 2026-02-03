package com.example.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig(
    @Value("\${app.cors.allowedOrigin}") private val allowedOrigin: String
) : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        val origins = allowedOrigin
            .split(",")
            .map { it.trim() }
            .filter { it.isNotBlank() }

        registry.addMapping("/**")
            .allowedOrigins(*origins.toTypedArray())
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Set-Cookie")
            .allowCredentials(true)
            .maxAge(3600)
    }
}
