package com.example.backend.controller

import com.example.backend.dto.AuthResponse
import com.example.backend.dto.PromoteInstructorByEmailRequest
import com.example.backend.service.AdminInstructorService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/instructors")
class AdminInstructorController(
    private val adminInstructorService: AdminInstructorService
) {

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/promote")
    fun promoteInstructor(
        @RequestBody req: PromoteInstructorByEmailRequest
    ): AuthResponse {

        return AuthResponse(
            adminInstructorService.promoteToInstructor(req.email)
        )
    }
}
