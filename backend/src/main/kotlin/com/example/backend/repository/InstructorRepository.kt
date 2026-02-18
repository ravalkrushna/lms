package com.example.backend.repository

import com.example.backend.dto.*
import com.example.backend.model.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository

@Repository
class InstructorRepository {

    fun findByAuthId(authId: Long): InstructorProfileResponse? = transaction {

        val row = InstructorsTable
            .join(UserAuthTable, JoinType.INNER,
                onColumn = InstructorsTable.userId,
                otherColumn = UserAuthTable.id
            )
            .selectAll()
            .where { InstructorsTable.userId eq authId }
            .singleOrNull() ?: return@transaction null

        InstructorProfileResponse(
            id = row[UserAuthTable.id],                 // ✅ FROM AUTH TABLE
            name = row[UserAuthTable.name],             // ✅ TRUST AUTH TABLE
            email = row[UserAuthTable.email],
            role = row[UserAuthTable.role],             // ✅ THE FIX 🔥

            contactNo = row[InstructorsTable.contactNo],
            address = row[InstructorsTable.address],
            salary = row[InstructorsTable.salary],
            designation = row[InstructorsTable.designation]
        )
    }


    /** ✅ Update Instructor Profile */
    fun updateProfile(authId: Long, req: UpdateInstructorRequest) = transaction {

        InstructorsTable.update({ InstructorsTable.userId eq authId }) {

            req.contactNo?.let { it1 -> it[contactNo] = it1 }
            req.address?.let { it1 -> it[address] = it1 }
            req.salary?.let { it1 -> it[salary] = it1 }
            req.designation?.let { it1 -> it[designation] = it1 }
        }
    }

    fun createInstructorProfile(
        userId: Long,
        req: CreateInstructorRequest
    ) {

        InstructorsTable.insert {

            it[InstructorsTable.userId] = userId
            it[name] = req.name
            it[email] = req.email.trim().lowercase()

            it[contactNo] = req.contactNo
            it[address] = req.address
            it[salary] = req.salary
            it[designation] = req.designation
        }
    }


    /** ✅ Dashboard Stats (🔥 CORRECTED LOGIC) */
    fun getDashboardStats(authId: Long): InstructorDashboardStats = transaction {

        /** Total courses created by instructor */
        val totalCourses = CoursesTable
            .selectAll()
            .where { CoursesTable.instructorId eq authId }
            .count()

        /** Total students across instructor courses */
        val totalStudents = EnrollmentsTable
            .join(CoursesTable, JoinType.INNER,
                onColumn = EnrollmentsTable.courseId,
                otherColumn = CoursesTable.id
            )
            .selectAll()
            .where { CoursesTable.instructorId eq authId }
            .count()

        InstructorDashboardStats(
            totalCourses = totalCourses,
            totalStudents = totalStudents
        )
    }

    private fun toCourse(row: ResultRow): Course {
        return Course(
            id = row[CoursesTable.id],
            title = row[CoursesTable.title],
            description = row[CoursesTable.description],
            instructorId = row[CoursesTable.instructorId],
            status = row[CoursesTable.status]
        )
    }



    fun findById(courseId: Long): Course? = transaction {
        CoursesTable
            .selectAll()
            .where { CoursesTable.id eq courseId }
            .map(::toCourse)
            .singleOrNull()
    }


}
