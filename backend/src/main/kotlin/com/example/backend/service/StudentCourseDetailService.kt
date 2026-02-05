package com.example.backend.service

import com.example.backend.dto.StudentCourseDetailResponse
import com.example.backend.repository.StudentCourseDetailRepository
import org.springframework.stereotype.Service

@Service
class StudentCourseDetailService(
    private val repository: StudentCourseDetailRepository
) {
    fun getCourseDetail(userId: Long, courseId: Long): StudentCourseDetailResponse {
        return repository.getCourseDetail(userId, courseId)
    }
}
