package com.example.backend.controller

import com.example.backend.dto.AdminUserResponse
import com.example.backend.dto.CreateInstructorRequest
import com.example.backend.dto.PromoteInstructorRequest
import com.example.backend.dto.UserDetailResponse
import com.example.backend.service.AdminService
import com.example.backend.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
class AdminController(
    private val adminService: AdminService,
    private val authService: AuthService
) {

    @GetMapping("/users")
    fun listUsers(): List<AdminUserResponse> =
        adminService.listAllUsers()

    @PostMapping("/instructor")
    fun createInstructor(
        @RequestBody req: CreateInstructorRequest
    ) {
        adminService.createInstructor(req)
    }


    @GetMapping("/users/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserDetailResponse> {
        return ResponseEntity.ok(authService.getUserById(id))
    }

}
