package com.example.backend.controller

import com.example.backend.dto.*
import com.example.backend.service.AuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/signup")
    fun signup(@Valid @RequestBody req: SignupRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.signup(req)))
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@Valid @RequestBody req: VerifyOtpRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.verifyOtp(req)))
    }

    @PostMapping("/login")
    fun login(
        @Valid @RequestBody req: LoginRequest,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<SessionResponse> {
        return ResponseEntity.ok(authService.login(req, request, response))
    }

    @GetMapping("/me")
    fun me(): ResponseEntity<SessionResponse> {
        val session = authService.getSessionInfo()
            ?: return ResponseEntity.status(401).build()

        return ResponseEntity.ok(session)
    }

    @PostMapping("/resend-otp")
    fun resendOtp(@Valid @RequestBody req: ResendOtpRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.resendOtp(req)))
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest, response: HttpServletResponse): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.logout(request, response)))
    }

}
