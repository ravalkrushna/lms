package com.example.backend.controller

import com.example.backend.dto.CreateLessonRequest
import com.example.backend.dto.LessonResponse
import com.example.backend.dto.UpdateLessonRequest
import com.example.backend.service.LessonService
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class LessonController(
    private val lessonService: LessonService
) {

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_INSTRUCTOR')")
    @PostMapping("/sections/{sectionId}/lessons")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @PathVariable sectionId: Long,
        @RequestBody req: CreateLessonRequest
    ): LessonResponse {
        return lessonService.create(sectionId, req)
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_INSTRUCTOR')")
    @GetMapping("/sections/{sectionId}/lessons")
    fun listBySection(@PathVariable sectionId: Long): List<LessonResponse> {
        return lessonService.listBySection(sectionId)
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_INSTRUCTOR')")
    @GetMapping("/lessons/{lessonId}")
    fun getById(@PathVariable lessonId: Long): LessonResponse {
        return lessonService.getById(lessonId)
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_INSTRUCTOR')")
    @PutMapping("/lessons/{lessonId}")
    fun update(
        @PathVariable lessonId: Long,
        @RequestBody req: UpdateLessonRequest
    ): LessonResponse {
        return lessonService.update(lessonId, req)
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_INSTRUCTOR')")
    @DeleteMapping("/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable lessonId: Long) {
        lessonService.delete(lessonId)
    }
}
