package com.example.backend.controller

import com.example.backend.dto.PublicCourseResponse
import com.example.backend.service.PublicCourseDetailService
import com.example.backend.service.PublicCourseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/courses")
class PublicCourseController(
    private val publicCourseService: PublicCourseService,
    private val publicCourseDetailService: PublicCourseDetailService
) {

    @GetMapping
    fun browseCourses(
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ) = publicCourseService.browseCourses(search, page, size)

    @GetMapping("/{id}")
    fun getCourseDetail(
        @PathVariable id: Long
    ) = publicCourseDetailService.getCourseDetail(id)
}
