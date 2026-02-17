package com.example.backend.controller

import com.example.backend.service.*
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/courses")
class CourseController(
    private val publicCourseService: PublicCourseService
) {

    @GetMapping
    fun browseCourses(
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ) = publicCourseService.browseCourses(search, page, size)

    @GetMapping("/{courseId}")
    fun courseDetail(@PathVariable courseId: Long) =
        publicCourseService.getCourseDetail(courseId)

    @GetMapping("/{courseId}/curriculum")
    fun curriculum(@PathVariable courseId: Long) =
        publicCourseService.getCurriculum(courseId)
}
