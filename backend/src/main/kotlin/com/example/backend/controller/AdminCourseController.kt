package com.example.backend.controller

import com.example.backend.dto.CourseResponse
import com.example.backend.service.CourseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/courses")
class AdminCourseController(
    private val courseService: CourseService
) {

    @GetMapping
    fun allCourses(): ResponseEntity<List<CourseResponse>> =
        ResponseEntity.ok(courseService.listAllCourses())
}
