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
    ): List<PublicCourseResponse> =
        publicCourseRepository.findPublishedCourses(search, page, size)
}
