package com.example.backend.controller

import com.example.backend.dto.*
import com.example.backend.service.CourseService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/courses")
class CourseController(
    private val courseService: CourseService
) {

    @PostMapping
    fun create(@Valid @RequestBody req: CreateCourseRequest): ResponseEntity<CourseResponse> {
        return ResponseEntity.ok(courseService.createCourse(req))
    }

    @GetMapping("/published")
    fun listPublished(): ResponseEntity<List<CourseResponse>> {
        return ResponseEntity.ok(courseService.listPublishedCourses())
    }

    @GetMapping("/my")
    fun myCourses(): ResponseEntity<List<CourseResponse>> {
        return ResponseEntity.ok(courseService.myCourses())
    }

    @GetMapping("/{id}")
    fun getOne(@PathVariable id: Long): ResponseEntity<CourseResponse> {
        return ResponseEntity.ok(courseService.getCourse(id))
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: UpdateCourseRequest
    ): ResponseEntity<CourseResponse> {
        return ResponseEntity.ok(courseService.updateCourse(id, req))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Map<String, String>> {
        val msg = courseService.deleteCourse(id)
        return ResponseEntity.ok(mapOf("message" to msg))
    }
}
