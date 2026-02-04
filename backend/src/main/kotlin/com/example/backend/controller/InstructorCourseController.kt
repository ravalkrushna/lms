package com.example.backend.controller

import com.example.backend.dto.AuthResponse
import com.example.backend.dto.CourseResponse
import com.example.backend.dto.CreateCourseRequest
import com.example.backend.service.CourseService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/instructor/courses")
@PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
class InstructorCourseController(
    private val courseService: CourseService
) {

    @PostMapping
    fun createCourse(@Valid @RequestBody req: CreateCourseRequest): ResponseEntity<CourseResponse> =
        ResponseEntity.ok(courseService.createCourse(req))

    @PatchMapping("/{courseId}/publish")
    fun publishCourse(@PathVariable courseId: Long): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(AuthResponse(courseService.publishCourse(courseId)))

    @GetMapping
    fun myCourses(): ResponseEntity<List<CourseResponse>> =
        ResponseEntity.ok(courseService.listMyCourses())
}
