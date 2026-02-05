package com.example.backend.controller

import com.example.backend.model.LessonProgressStatus
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.LessonProgressService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courses/{courseId}/lessons/{lessonId}/progress")
class StudentLessonProgressController(
    private val lessonProgressService: LessonProgressService
) {

    @PostMapping
    fun updateProgress(
        @PathVariable courseId: Long,
        @PathVariable lessonId: Long,
        @RequestParam status: LessonProgressStatus,
        authentication: Authentication
    ) {
        val principal = authentication.principal as CustomUserPrincipal
        lessonProgressService.updateProgress(
            principal.id,
            courseId,
            lessonId,
            status
        )
    }

    @GetMapping
    fun getProgress(
        @PathVariable lessonId: Long,
        authentication: Authentication
    ): LessonProgressStatus {
        val principal = authentication.principal as CustomUserPrincipal
        return lessonProgressService.getProgress(principal.id, lessonId)
    }
}
