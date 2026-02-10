package com.example.backend.controller

import com.example.backend.service.*
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/public/courses")
class PublicCourseController(
    private val publicCourseService: PublicCourseService,
    private val publicCourseDetailService: PublicCourseDetailService,
    private val publicCurriculumService: PublicCurriculumService
) {

    @GetMapping
    fun browseCourses(
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ) = publicCourseService.browseCourses(search, page, size)

    @GetMapping("/{id}")
    fun courseDetail(@PathVariable id: Long) =
        publicCourseDetailService.getCourseDetail(id)

    @GetMapping("/{id}/curriculum")
    fun curriculum(@PathVariable id: Long) =
        publicCurriculumService.getCurriculum(id)
}
