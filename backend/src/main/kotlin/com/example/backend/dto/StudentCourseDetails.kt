package com.example.backend.dto

data class StudentCourseDetailResponse(
    val courseId: Long,
    val title: String,
    val sections: List<StudentSectionResponse>
)

data class StudentSectionResponse(
    val sectionId: Long,
    val title: String,
    val lessons: List<StudentLessonSummaryResponse>
)

data class StudentLessonSummaryResponse(
    val lessonId: Long,
    val title: String,
    val completed: Boolean
)
