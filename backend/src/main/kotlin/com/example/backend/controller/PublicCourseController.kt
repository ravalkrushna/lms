package com.example.backend.controller

import com.example.backend.dto.CourseResponse
import com.example.backend.service.CourseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/courses")
class PublicCourseController(
    private val courseService: CourseService
) {

    @GetMapping
    fun publishedCourses(): ResponseEntity<List<CourseResponse>> =
        ResponseEntity.ok(courseService.listPublishedCourses())
}
