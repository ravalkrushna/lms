package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.OtpRepository
import com.example.backend.repository.UserRepository
import com.example.backend.security.SecurityUtils
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant
import kotlin.random.Random

@Service
class AuthService(
    private val authRepository: AuthRepository,
    private val otpRepository: OtpRepository,
    private val userRepository: UserRepository,
    private val authenticationManager: AuthenticationManager,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService
) {

    /* ================= SIGNUP ================= */

    fun signup(req: SignupRequest): String {
        return signupInternal(
            nameRaw = req.name,
            emailRaw = req.email,
            passwordRaw = req.password,
            contactNoRaw = req.contactNo,
            addressRaw = req.address
        )
    }

    private fun signupInternal(
        nameRaw: String?,
        emailRaw: String,
        passwordRaw: String,
        contactNoRaw: String?,
        addressRaw: String?
    ): String {

        val email = emailRaw.trim().lowercase()
        val name = nameRaw?.trim() ?: "Student"

        transaction {

            if (authRepository.existsByEmail(email)) {
                throw RuntimeException("User already exists")
            }

            val passwordHash = passwordEncoder.encode(passwordRaw).toString()

            /** ✅ CREATE STUDENT (Lifecycle Safe) */
            val userId = authRepository.createStudent(
                name = name,
                email = email,
                passwordHash = passwordHash
            )

            /** ✅ CREATE PROFILE */
            userRepository.createProfile(
                authId = userId,
                email = email,
                req = UserProfileRequest(
                    name = name,
                    contactNo = contactNoRaw,
                    address = addressRaw
                )
            )

            sendOtp(email)
        }

        return "Signup initiated. OTP sent to email."
    }

    /* ================= OTP ================= */

    fun verifyOtp(req: VerifyOtpRequest): String {

        val email = req.email.trim().lowercase()
        val otp = req.otp.trim()

        transaction {

            val otpRow = otpRepository.findByEmail(email)
                ?: throw RuntimeException("OTP not found, signup again")

            if (otpRow.verified) throw RuntimeException("OTP already verified")
            if (otpRow.expiresAt.isBefore(Instant.now())) throw RuntimeException("OTP expired")
            if (otpRow.attemptsLeft <= 0) throw RuntimeException("Too many wrong attempts")

            val valid = passwordEncoder.matches(otp, otpRow.otpHash)

            if (!valid) {
                val left = otpRepository.decrementAttempts(email)
                throw RuntimeException("Invalid OTP. Attempts left: $left")
            }

            otpRepository.markVerified(email)
            authRepository.markEmailVerified(email)
        }

        return "OTP verified. Signup successful."
    }

    fun resendOtp(req: ResendOtpRequest): String {

        val email = req.email.trim().lowercase()

        transaction {

            val user = authRepository.findByEmail(email)
                ?: throw RuntimeException("User not found")

            if (user.emailVerified) {
                throw RuntimeException("Email already verified")
            }

            sendOtp(email)
        }

        return "New OTP sent successfully"
    }

    /* ================= LOGIN ================= */

    fun login(req: LoginRequest, request: HttpServletRequest): SessionResponse {

        val email = req.email.trim().lowercase()

        val user = transaction {
            authRepository.findByEmail(email)
        } ?: throw RuntimeException("Invalid email or password")

        if (!user.emailVerified) {
            throw RuntimeException("Please verify OTP before login")
        }

        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(email, req.password)
        )

        val securityContext = SecurityContextHolder.createEmptyContext().apply {
            this.authentication = authentication
        }

        SecurityContextHolder.setContext(securityContext)

        val session = request.getSession(true)
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext)

        return SessionResponse(
            userId = user.id,
            name = user.name,
            email = user.email,
            role = user.role
        )
    }

    fun logout(request: HttpServletRequest, response: HttpServletResponse): String {

        SecurityContextHolder.clearContext()
        request.getSession(false)?.invalidate()

        val cookie = Cookie("JSESSIONID", null).apply {
            path = "/"
            isHttpOnly = true
            maxAge = 0
        }

        response.addCookie(cookie)

        return "Logout successful"
    }

    fun getSessionInfo(): SessionResponse? {

        val email = SecurityUtils.currentEmailOrNull()?.trim()?.lowercase()
            ?: return null

        return transaction {

            val user = authRepository.findByEmail(email)
                ?: return@transaction null

            SessionResponse(
                userId = user.id,
                name = user.name,
                email = user.email,
                role = user.role
            )
        }
    }

    /* ================= OTP HELPER ================= */

    private fun sendOtp(email: String) {

        val otp = Random.nextInt(100000, 999999).toString()
        val otpHash = passwordEncoder.encode(otp).toString()

        otpRepository.upsertOtp(
            email = email,
            otpHash = otpHash,
            expiresAt = Instant.now().plusSeconds(10 * 60)
        )

        emailService.sendOtp(email, otp)
    }
}
