package com.example.backend.service

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender
) {
    fun sendOtp(email: String, otp: String) {
        val msg = SimpleMailMessage().apply {
            setTo(email)
            subject = "OTP Verification - LMS"
            text = "Your OTP is: $otp\nValid for 10 minutes."
        }
        mailSender.send(msg)
    }
}
