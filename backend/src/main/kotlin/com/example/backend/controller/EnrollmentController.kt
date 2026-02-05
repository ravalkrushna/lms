package com.example.backend.controller

import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.EnrollmentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/enrollments")
class EnrollmentController(
    private val enrollmentService: EnrollmentService
) {

    @PostMapping("/{courseId}")
    fun enroll(
        @PathVariable courseId: Long,
        authentication: Authentication
    ): ResponseEntity<Void> {

        val principal = authentication.principal as CustomUserPrincipal
        val userId = principal.id

        enrollmentService.enroll(userId, courseId)

        return ResponseEntity.status(HttpStatus.CREATED).build()
    }
}
