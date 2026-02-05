package com.example.backend.controller

import com.example.backend.dto.ProgressResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.CourseProgressService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courses/{courseId}/progress")
class StudentCourseProgressController(
    private val courseProgressService: CourseProgressService
) {

    @GetMapping
    fun getProgress(
        @PathVariable courseId: Long,
        authentication: Authentication
    ): ProgressResponse {

        val principal = authentication.principal as CustomUserPrincipal
        return courseProgressService.getCourseProgress(principal.id, courseId)
    }
}
