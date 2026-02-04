package com.example.backend.service

import com.example.backend.dto.*
import com.example.backend.model.UserRole
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.OtpRepository
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
    private val authenticationManager: AuthenticationManager,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService
) {

    fun signup(req: SignupRequest): String {
        val email = req.email.trim().lowercase()
        val name = req.name.trim()

        transaction {
            if (authRepository.existsByEmail(email)) {
                throw RuntimeException("User already exists")
            }

            authRepository.createUser(
                name = name,
                email = email,
                passwordHash = passwordEncoder.encode(req.password)!!,
                role = UserRole.STUDENT.name
            )

            val otp = generateOtp()
            otpRepository.upsertOtp(
                email = email,
                otpHash = passwordEncoder.encode(otp)!!,
                expiresAt = Instant.now().plusSeconds(10 * 60)
            )

            emailService.sendOtp(email, otp)
        }

        return "Signup initiated. OTP sent to email."
    }

    fun signupInstructor(req: InstructorSignupRequest): String {
        val email = req.email.trim().lowercase()
        val name = req.name.trim()

        transaction {
            if (authRepository.existsByEmail(email)) {
                throw RuntimeException("User already exists")
            }

            authRepository.createUser(
                name = name,
                email = email,
                passwordHash = passwordEncoder.encode(req.password)!!,
                role = UserRole.INSTRUCTOR.name
            )

            val otp = generateOtp()
            otpRepository.upsertOtp(
                email = email,
                otpHash = passwordEncoder.encode(otp)!!,
                expiresAt = Instant.now().plusSeconds(10 * 60)
            )

            emailService.sendOtp(email, otp)
        }

        return "Instructor signup initiated. OTP sent."
    }

    fun verifyOtp(req: VerifyOtpRequest): String {
        val email = req.email.trim().lowercase()
        val otp = req.otp.trim()

        transaction {
            val otpRow = otpRepository.findByEmail(email)
                ?: throw RuntimeException("OTP not found, signup again")

            if (otpRow.verified) throw RuntimeException("OTP already verified")
            if (otpRow.expiresAt.isBefore(Instant.now())) throw RuntimeException("OTP expired")
            if (otpRow.attemptsLeft <= 0) throw RuntimeException("Too many wrong attempts")

            val ok = passwordEncoder.matches(otp, otpRow.otpHash)
            if (!ok) {
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

            val otp = generateOtp()
            otpRepository.upsertOtp(
                email = email,
                otpHash = passwordEncoder.encode(otp)!!,
                expiresAt = Instant.now().plusSeconds(10 * 60)
            )

            emailService.sendOtp(email, otp)
        }

        return "New OTP sent successfully"
    }

    fun login(req: LoginRequest, request: HttpServletRequest): SessionResponse {
        val email = req.email.trim().lowercase()

        // ✅ DB validation in transaction
        val user = transaction {
            authRepository.findByEmail(email)
        } ?: throw RuntimeException("Invalid email or password")

        if (!user.emailVerified) {
            throw RuntimeException("Please verify OTP before login")
        }

        // ✅ authentication manager validates password properly
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(email, req.password)
        )

        val securityContext = SecurityContextHolder.createEmptyContext().apply {
            this.authentication = authentication
        }

        SecurityContextHolder.setContext(securityContext)

        // ✅ Save context in session (session based login)
        val session = request.getSession(true)
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext)

        // ✅ No DB call here again (optimized)
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
        val email = SecurityUtils.currentEmailOrNull() ?: return null

        return transaction {
            val user = authRepository.findByEmail(email) ?: return@transaction null

            SessionResponse(
                userId = user.id,
                name = user.name,
                email = user.email,
                role = user.role
            )
        }
    }

    // ✅ helper
    private fun generateOtp(): String {
        return Random.nextInt(100000, 999999).toString()
    }
}
