package com.example.backend.controller

import com.example.backend.dto.InstructorProfileRequest
import com.example.backend.dto.InstructorProfileResponse
import com.example.backend.dto.UpdateInstructorRequest
import com.example.backend.security.CustomUserPrincipal
import com.example.backend.service.InstructorService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/instructors")
class InstructorController(private val instructorService: InstructorService) {

    @PostMapping("/profile")
    fun createProfile(
        @AuthenticationPrincipal user: CustomUserPrincipal,
        @RequestBody req: InstructorProfileRequest
    ) {
        instructorService.createProfile(user.id, user.getEmail(), req)
    }

    @GetMapping("/me")
    fun getMyProfile(@AuthenticationPrincipal user: CustomUserPrincipal): InstructorProfileResponse {
        return instructorService.getProfile(user.id)
    }

    @PutMapping("/profile")
    fun updateProfile(
        @AuthenticationPrincipal user: CustomUserPrincipal,
        @RequestBody req: UpdateInstructorRequest
    ) {
        instructorService.updateProfile(user.id, req)
    }
}
