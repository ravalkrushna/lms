package com.example.backend.model

import org.jetbrains.exposed.sql.Table

object UsersTable : Table("users") {

    val userId = long("user_id")
        .uniqueIndex()
        .references(UserAuthTable.id)

    val name = text("name")
    val email = text("email")

    val contactNo = text("contact_no").nullable()
    val address = text("address").nullable()
}
