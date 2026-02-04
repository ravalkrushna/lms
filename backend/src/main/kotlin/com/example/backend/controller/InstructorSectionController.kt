package com.example.backend.controller

import com.example.backend.dto.*
import com.example.backend.service.SectionService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/instructor")
class InstructorSectionController(
    private val sectionService: SectionService
) {

    @PostMapping("/courses/{courseId}/sections")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    fun createSection(
        @PathVariable courseId: Long,
        @Valid @RequestBody req: CreateSectionRequest
    ): ResponseEntity<SectionResponse> {
        return ResponseEntity.ok(sectionService.createSection(courseId, req))
    }

    @GetMapping("/courses/{courseId}/sections")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    fun listSections(@PathVariable courseId: Long): ResponseEntity<List<SectionResponse>> {
        return ResponseEntity.ok(sectionService.listSections(courseId))
    }

    // ✅ FIXED PATH (remove extra /instructor)
    @PutMapping("/sections/{sectionId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    fun updateSection(
        @PathVariable sectionId: Long,
        @Valid @RequestBody req: UpdateSectionRequest
    ): ResponseEntity<SectionResponse> {
        return ResponseEntity.ok(sectionService.updateSection(sectionId, req))
    }

    // ✅ FIXED PATH (remove extra /instructor)
    @DeleteMapping("/sections/{sectionId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    fun deleteSection(@PathVariable sectionId: Long): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(sectionService.deleteSection(sectionId)))
    }
}
