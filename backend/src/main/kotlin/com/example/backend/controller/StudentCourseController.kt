package com.example.backend.controller

import com.example.backend.dto.StudentCourse
import com.example.backend.model.Enrollment
import com.example.backend.security.AuthUser
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.EnrollmentService
import com.example.backend.service.PublicCourseService
import com.example.backend.service.StudentCourseDetailService
import com.example.backend.service.StudentCourseService
import com.example.backend.service.StudentProgressService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/student/courses")
class StudentCourseController(
    private val studentCourseService: StudentCourseService,
    private val studentCourseDetailService: StudentCourseDetailService,
    private val enrollmentService: EnrollmentService

) {

    @GetMapping
    fun getMyCourses(
        @AuthenticationPrincipal principal: CustomUserPrincipal
    ) = studentCourseService.getMyCourses(principal.id)

    @GetMapping("/{courseId}")
    fun getCourseDetail(
        @AuthenticationPrincipal principal: CustomUserPrincipal,
        @PathVariable courseId: Long
    ) = studentCourseDetailService.getCourseDetail(principal.id, courseId)

    @PostMapping("/{courseId}/enroll")
    fun enrollCourse(
        @AuthenticationPrincipal principal: CustomUserPrincipal,
        @PathVariable courseId: Long
    ): ResponseEntity<Void> {

        enrollmentService.enroll(principal.id, courseId)

        return ResponseEntity.status(HttpStatus.CREATED).build()
    }
}
