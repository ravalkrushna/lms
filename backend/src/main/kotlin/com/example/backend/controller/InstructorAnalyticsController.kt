package com.example.backend.controller

import com.example.backend.dto.CourseAnalyticsResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.InstructorAnalyticsService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/instructor/courses")
class InstructorAnalyticsController(
    private val instructorAnalyticsService: InstructorAnalyticsService
) {

    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR','ROLE_ADMIN')")
    @GetMapping("/{courseId}/analytics")
    fun getAnalytics(
        @PathVariable courseId: Long,
        authentication: Authentication
    ): CourseAnalyticsResponse {

        val principal = authentication.principal as CustomUserPrincipal

        return instructorAnalyticsService.getCourseAnalytics(
            principal.id,
            courseId
        )
    }
}
