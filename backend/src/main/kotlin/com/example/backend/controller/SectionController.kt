package com.example.backend.controller

import com.example.backend.dto.CreateSectionRequest
import com.example.backend.dto.SectionResponse
import com.example.backend.service.SectionService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courses/{courseId}/sections")
class SectionController(
    private val sectionService: SectionService
) {

    @PostMapping
    fun createSection(
        @PathVariable courseId: Long,
        @Valid @RequestBody req: CreateSectionRequest
    ): ResponseEntity<SectionResponse> {
        return ResponseEntity.ok(sectionService.createSection(courseId, req))
    }

    @GetMapping
    fun listSections(@PathVariable courseId: Long): ResponseEntity<List<SectionResponse>> {
        return ResponseEntity.ok(sectionService.listSections(courseId))
    }
}
