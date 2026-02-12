package com.example.backend.controller

import com.example.backend.dto.StudentProfileResponse
import com.example.backend.service.StudentService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping
    ("/api/student")
class StudentController(
    private val studentService: StudentService
) {

    @GetMapping
        ("/profile")
    fun getProfile(): StudentProfileResponse {
        return studentService.getStudentProfile()
    }
}
