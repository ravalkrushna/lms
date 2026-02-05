package com.example.backend.repository

import com.example.backend.model.Enrollment
import com.example.backend.model.EnrollmentStatus
import com.example.backend.model.EnrollmentsTable
import com.example.backend.model.UserAuthTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class EnrollmentRepository {

    fun create(
        userId: Long,
        courseId: Long
    ): Enrollment =
        transaction {
            EnrollmentsTable
                .insert {
                    it[this.userId] = userId
                    it[this.courseId] = courseId
                    it[this.status] = EnrollmentStatus.ACTIVE.name
                    it[this.enrolledAt] = Instant.now()
                }
                .resultedValues!!
                .first()
                .toEnrollment()
        }

    fun existsActive(
        userId: Long,
        courseId: Long
    ): Boolean =
        transaction {
            EnrollmentsTable
                .selectAll()
                .where {
                    (EnrollmentsTable.userId eq userId) and
                            (EnrollmentsTable.courseId eq courseId) and
                            (EnrollmentsTable.status eq EnrollmentStatus.ACTIVE.name)
                }
                .limit(1)
                .any()
        }

    fun findByUser(
        userId: Long
    ): List<Enrollment> =
        transaction {
            EnrollmentsTable
                .selectAll()
                .where { EnrollmentsTable.userId eq userId }
                .map { it.toEnrollment() }
        }

    private fun ResultRow.toEnrollment() =
        Enrollment(
            id = this[EnrollmentsTable.id],
            userId = this[EnrollmentsTable.userId],
            courseId = this[EnrollmentsTable.courseId],
            status = EnrollmentStatus.valueOf(this[EnrollmentsTable.status]),
            enrolledAt = this[EnrollmentsTable.enrolledAt]
        )

    fun findStudentsByCourse(courseId: Long): List<Pair<Long, String>> =
        transaction {
            EnrollmentsTable
                .join(
                    otherTable = UserAuthTable,
                    joinType = JoinType.INNER,
                    onColumn = EnrollmentsTable.userId,
                    otherColumn = UserAuthTable.id
                )
                .selectAll().where {
                    EnrollmentsTable.courseId eq courseId
                }
                .map {
                    it[UserAuthTable.id] to it[UserAuthTable.email]
                }
        }


}
