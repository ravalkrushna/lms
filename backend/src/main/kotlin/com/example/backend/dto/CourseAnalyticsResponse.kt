package com.example.backend.dto

data class CourseAnalyticsResponse(
    val totalStudents: Int,
    val completedStudents: Int,
    val students: List<InstructorStudentProgress>
)
