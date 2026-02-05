package com.example.backend.service

import com.example.backend.dto.StudentCourse
import com.example.backend.repository.StudentCourseRepository
import org.springframework.stereotype.Service

@Service
class StudentCourseService(
    private val repository: StudentCourseRepository
) {
    fun getMyCourses(userId: Long): List<StudentCourse> {
        return repository.getStudentCourses(userId)
    }
}
