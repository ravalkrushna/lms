package com.example.backend.controller

import com.example.backend.dto.LessonResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.EnrollmentService
import com.example.backend.service.LessonService
import com.example.backend.utils.EnrollmentGuard
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courses/{courseId}/sections/{sectionId}/lessons")
class StudentLessonController(
    private val enrollmentService: EnrollmentService,
    private val lessonService: LessonService
) {

    @GetMapping
    fun listLessonsForStudent(
        @PathVariable courseId: Long,
        @PathVariable sectionId: Long,
        authentication: Authentication
    ): List<LessonResponse> {

        val principal = authentication.principal as CustomUserPrincipal
        val userId = principal.id

        EnrollmentGuard.requireEnrollment(
            enrollmentService,
            userId,
            courseId
        )

        return lessonService.listBySection(sectionId)
    }
}
