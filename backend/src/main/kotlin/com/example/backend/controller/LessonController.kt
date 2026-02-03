package com.example.backend.controller

import com.example.backend.dto.CreateLessonRequest
import com.example.backend.dto.LessonResponse
import com.example.backend.service.LessonService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sections/{sectionId}/lessons")
class LessonController(
    private val lessonService: LessonService
) {

    @PostMapping
    fun createLesson(
        @PathVariable sectionId: Long,
        @Valid @RequestBody req: CreateLessonRequest
    ): ResponseEntity<LessonResponse> {
        return ResponseEntity.ok(lessonService.createLesson(sectionId, req))
    }

    @GetMapping
    fun listLessons(@PathVariable sectionId: Long): ResponseEntity<List<LessonResponse>> {
        return ResponseEntity.ok(lessonService.listLessons(sectionId))
    }
}
