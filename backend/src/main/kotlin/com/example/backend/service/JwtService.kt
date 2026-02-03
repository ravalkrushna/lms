package com.example.backend.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date

@Service
class JwtService(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.expMinutes}") private val expMinutes: Long
) {
    fun generate(userId: Long, email: String): String {
        val now = Date()
        val exp = Date(now.time + expMinutes * 60_000)

        return Jwts.builder()
            .setSubject(userId.toString())
            .claim("email", email)
            .setIssuedAt(now)
            .setExpiration(exp)
            .signWith(SignatureAlgorithm.HS256, secret.toByteArray())
            .compact()
    }

    fun getUserId(token: String): Long {
        val claims = Jwts.parser()
            .setSigningKey(secret.toByteArray())
            .parseClaimsJws(token)
            .body
        return claims.subject.toLong()
    }
}
