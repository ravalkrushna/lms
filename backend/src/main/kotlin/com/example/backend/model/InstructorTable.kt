package com.example.backend.model

import org.jetbrains.exposed.sql.Table

object InstructorsTable : Table("instructors") {

    val userId = long("user_id")
        .uniqueIndex()
        .references(UserAuthTable.id)

    val salary = decimal("salary", 10, 2).nullable()
    val designation = text("designation").nullable()
}
