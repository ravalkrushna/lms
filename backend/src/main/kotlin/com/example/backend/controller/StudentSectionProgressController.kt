package com.example.backend.controller

import com.example.backend.dto.ProgressResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.SectionProgressService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sections/{sectionId}/progress")
class StudentSectionProgressController(
    private val sectionProgressService: SectionProgressService
) {

    @GetMapping
    fun getProgress(
        @PathVariable sectionId: Long,
        @RequestParam courseId: Long,
        authentication: Authentication
    ): ProgressResponse {

        val principal = authentication.principal as CustomUserPrincipal

        return sectionProgressService.getSectionProgress(
            principal.id,
            courseId,
            sectionId
        )
    }
}
