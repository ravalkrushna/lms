package com.example.backend.service

import com.example.backend.dto.PublicCourseResponse
import com.example.backend.repository.PublicCourseRepository
import org.springframework.stereotype.Service

@Service
class PublicCourseService(
    private val publicCourseRepository: PublicCourseRepository
) {

    fun browseCourses(
        search: String?,
        page: Int,
        size: Int
    ): List<PublicCourseResponse> {

        require(page >= 0) { "Page must be >= 0" }
        require(size in 1..50) { "Size must be between 1 and 50" }

        return publicCourseRepository.findPublishedCourses(search, page, size)
    }
}
