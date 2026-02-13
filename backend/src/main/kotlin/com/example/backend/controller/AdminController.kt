package com.example.backend.controller

import com.example.backend.dto.AdminUserResponse
import com.example.backend.service.AdminService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
class AdminController(
    private val adminService: AdminService
) {

    @GetMapping("/users")
    fun listUsers(): List<AdminUserResponse> =
        adminService.listAllUsers()
}
