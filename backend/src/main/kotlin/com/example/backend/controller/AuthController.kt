package com.example.backend.controller

import com.example.backend.dto.*
import com.example.backend.service.AuthService
import com.example.backend.service.ForgotPasswordService
import com.example.backend.service.PasswordService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val passwordService: PasswordService,
    private val forgotPasswordService: ForgotPasswordService
) {

    @PostMapping("/signup")
    fun signup(@Valid @RequestBody req: SignupRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.signup(req)))
    }

    @PostMapping("/signup/instructor")
    fun instructorSignup(@Valid @RequestBody req: InstructorSignupRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.signupInstructor(req)))
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@Valid @RequestBody req: VerifyOtpRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.verifyOtp(req)))
    }

    @PostMapping("/resend-otp")
    fun resendOtp(@Valid @RequestBody req: ResendOtpRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.resendOtp(req)))
    }

    @PostMapping("/login")
    fun login(
        @Valid @RequestBody req: LoginRequest,
        request: HttpServletRequest
    ): ResponseEntity<SessionResponse> {
        return ResponseEntity.ok(authService.login(req, request))
    }

    @GetMapping("/me")
    fun me(): ResponseEntity<SessionResponse> {
        val session = authService.getSessionInfo()
            ?: return ResponseEntity.status(401).build()

        return ResponseEntity.ok(session)
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest, response: HttpServletResponse): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(AuthResponse(authService.logout(request, response)))
    }

    @PutMapping("/change-password")
    fun changePassword(@Valid @RequestBody req: ChangePasswordRequest): ResponseEntity<AuthResponse> {
        passwordService.changePassword(req)
        return ResponseEntity.ok(AuthResponse("Password updated successfully"))
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@Valid @RequestBody req: ForgotPasswordRequest): ResponseEntity<AuthResponse> {
        forgotPasswordService.forgotPassword(req)
        return ResponseEntity.ok(AuthResponse("OTP sent successfully"))
    }

    @PostMapping("/reset-password")
    fun resetPassword(@Valid @RequestBody req: ResetPasswordRequest): ResponseEntity<AuthResponse> {
        forgotPasswordService.resetPassword(req)
        return ResponseEntity.ok(AuthResponse("Password reset successfully"))
    }
}
