package com.example.backend.controller

import com.example.backend.dto.LessonResponse
import com.example.backend.dto.StudentLessonResponse
import com.example.backend.repository.StudentLessonRepository
import com.example.backend.security.CustomUserPrincipal
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/student/lessons")
class StudentLessonController(
    private val repository: StudentLessonRepository
) {

    @GetMapping("/{lessonId}")
    fun getLesson(
        @AuthenticationPrincipal principal: CustomUserPrincipal,
        @PathVariable lessonId: Long
    ): ResponseEntity<StudentLessonResponse> {

        return ResponseEntity.ok(
            repository.getLesson(principal.id, lessonId)
        )
    }
}
