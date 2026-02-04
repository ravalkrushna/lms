package com.example.backend.service

import com.example.backend.dto.ForgotPasswordRequest
import com.example.backend.dto.ResetPasswordRequest
import com.example.backend.repository.AuthRepository
import com.example.backend.repository.OtpRepository
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class ForgotPasswordService(
    private val authRepository: AuthRepository,
    private val otpRepository: OtpRepository,
    private val emailService: EmailService,
    private val passwordEncoder: PasswordEncoder
) {

    fun forgotPassword(req: ForgotPasswordRequest) {
        val email = req.email.trim().lowercase()

        transaction {
            val exists = authRepository.findByEmail(email) != null
            if (!exists) throw IllegalArgumentException("User not found")

            val otp = generateOtp()
            val otpHash = passwordEncoder.encode(otp)
                ?: throw IllegalStateException("Failed to encode OTP")

            otpRepository.upsertOtp(
                email = email,
                otpHash = otpHash,
                expiresAt = Instant.now().plusSeconds(10 * 60)
            )

            emailService.sendOtp(email, otp)
        }
    }

    fun resetPassword(req: ResetPasswordRequest) {
        val email = req.email.trim().lowercase()

        if (req.newPassword != req.confirmNewPassword) {
            throw IllegalArgumentException("New password and confirm password do not match")
        }

        if (req.newPassword.length < 8) {
            throw IllegalArgumentException("Password must be at least 8 characters")
        }

        transaction {
            val user = authRepository.findByEmail(email)
                ?: throw IllegalArgumentException("User not found")

            val otpRow = otpRepository.findByEmail(email)
                ?: throw IllegalArgumentException("OTP not found, request OTP again")

            if (otpRow.verified) throw IllegalArgumentException("OTP already used, request new OTP")
            if (otpRow.expiresAt.isBefore(Instant.now())) throw IllegalArgumentException("OTP expired")
            if (otpRow.attemptsLeft <= 0) throw IllegalArgumentException("Too many wrong attempts")

            val ok = passwordEncoder.matches(req.otp.trim(), otpRow.otpHash)
            if (!ok) {
                val left = otpRepository.decrementAttempts(email)
                throw IllegalArgumentException("Invalid OTP. Attempts left: $left")
            }

            val newHash = passwordEncoder.encode(req.newPassword)
                ?: throw IllegalStateException("Failed to encode password")

            authRepository.updatePasswordHash(user.id, newHash)
            otpRepository.markVerified(email)
        }
    }

    private fun generateOtp(): String {
        return kotlin.random.Random.nextInt(100000, 999999).toString()
    }
}
