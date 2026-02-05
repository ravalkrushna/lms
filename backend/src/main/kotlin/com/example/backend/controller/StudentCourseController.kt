package com.example.backend.controller

import com.example.backend.dto.StudentCourse
import com.example.backend.security.AuthUser
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.StudentCourseService
import com.example.backend.service.StudentProgressService
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
    private val studentProgressService: StudentProgressService
) {

    @GetMapping
    fun getMyCourses(
        @AuthenticationPrincipal principal: CustomUserPrincipal
    ): ResponseEntity<List<StudentCourse>> {

        return ResponseEntity.ok(
            studentCourseService.getMyCourses(principal.id)
        )
    }


    @PostMapping("/lessons/{lessonId}/complete")
    fun completeLesson(
        @AuthenticationPrincipal user: AuthUser,
        @PathVariable lessonId: Long
    ): ResponseEntity<Void> {

        studentProgressService.completeLesson(user.id, lessonId)
        return ResponseEntity.ok().build()
    }

}
