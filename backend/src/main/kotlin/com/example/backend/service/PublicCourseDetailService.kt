package com.example.backend.service

import com.example.backend.dto.PublicCourseDetailResponse
import com.example.backend.model.*
import com.example.backend.repository.CourseRepository
import org.jetbrains.exposed.sql.countDistinct
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class PublicCourseDetailService(
    private val courseRepository: CourseRepository
) {

    fun getCourseDetail(courseId: Long): PublicCourseDetailResponse =
        transaction {
            val row = courseRepository.findPublishedCourseDetail(courseId)
                ?: throw RuntimeException("Course not found")

            PublicCourseDetailResponse(
                id = row[CoursesTable.id],
                title = row[CoursesTable.title],
                description = row[CoursesTable.description],
                instructorName = row[UserAuthTable.name],
                totalSections = row[SectionsTable.id.countDistinct()].toInt(),
                totalLessons = row[LessonTable.id.countDistinct()].toInt()
            )
        }
}
