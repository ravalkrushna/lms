package com.example.backend.controller

import com.example.backend.dto.AuthResponse
import com.example.backend.dto.UpdateUserRoleRequest
import com.example.backend.service.AdminUserService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
class AdminUserController(
    private val adminUserService: AdminUserService
) {

    @PatchMapping("/{email}/role")
    fun updateUserRole(
        @PathVariable email: String,
        @Valid @RequestBody req: UpdateUserRoleRequest
    ): ResponseEntity<AuthResponse> {
        val msg = adminUserService.updateUserRole(email, req.role)
        return ResponseEntity.ok(AuthResponse(msg))
    }
}
