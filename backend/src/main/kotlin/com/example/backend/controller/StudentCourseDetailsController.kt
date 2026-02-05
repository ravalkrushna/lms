package com.example.backend.controller

import com.example.backend.dto.StudentCourseDetailResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.StudentCourseDetailService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/student/courses")
class StudentCourseDetailController(
    private val service: StudentCourseDetailService
) {

    @GetMapping("/{courseId}")
    fun getCourseDetail(
        @AuthenticationPrincipal principal: CustomUserPrincipal,
        @PathVariable courseId: Long
    ): ResponseEntity<StudentCourseDetailResponse> {

        return ResponseEntity.ok(
            service.getCourseDetail(principal.id, courseId)
        )
    }
}
