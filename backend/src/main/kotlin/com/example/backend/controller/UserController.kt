package com.example.backend.controller

import com.example.backend.dto.UserProfileRequest
import com.example.backend.dto.UserProfileResponse
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.UserService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @PostMapping("/profile")
    fun createProfile(
        @AuthenticationPrincipal user: CustomUserPrincipal,
        @RequestBody req: UserProfileRequest
    ) {
        userService.createProfile(user.id, user.getEmail(), req)
    }

    @GetMapping("/me")
    fun getMyProfile(@AuthenticationPrincipal user: CustomUserPrincipal): UserProfileResponse {
        return userService.getProfile(user.id)
    }

    @PutMapping("/profile")
    fun updateProfile(
        @AuthenticationPrincipal user: CustomUserPrincipal,
        @RequestBody req: UserProfileRequest
    ) {
        userService.updateProfile(user.id, req)
    }
}
