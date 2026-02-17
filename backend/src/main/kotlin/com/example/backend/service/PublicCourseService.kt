package com.example.backend.service

import com.example.backend.dto.PublicCourseDetailResponse
import com.example.backend.dto.PublicCourseResponse
import com.example.backend.model.CoursesTable
import com.example.backend.model.LessonTable
import com.example.backend.model.SectionsTable
import com.example.backend.model.UserAuthTable
import com.example.backend.repository.CourseRepository
import com.example.backend.repository.PublicCourseRepository
import org.jetbrains.exposed.sql.countDistinct
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class PublicCourseService(
    private val publicCourseRepository: PublicCourseRepository,
    private val courseRepository: CourseRepository
) {

    fun browseCourses(search: String?, page: Int, size: Int) =
        publicCourseRepository.findPublishedCourses(search, page, size)

    fun getCourseDetail(courseId: Long) = transaction {
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

    fun getCurriculum(courseId: Long) =
        courseRepository.getPublicCurriculum(courseId)
}
