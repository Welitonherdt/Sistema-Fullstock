package com.fullstock.security;

import com.fullstock.common.enums.Role;
import com.fullstock.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationHours;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-hours}") long expirationHours
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationHours = expirationHours;
    }

    public String generateToken(User user) {
        Date issuedAt = new Date();
        Date expiresAt = Date.from(
            LocalDateTime.now()
                .plusHours(expirationHours)
                .atZone(ZoneId.systemDefault())
                .toInstant()
        );

        return Jwts.builder()
            .subject(user.getEmail())
            .claim("uid", user.getId())
            .claim("name", user.getName())
            .claim("role", user.getRole().name())
            .issuedAt(issuedAt)
            .expiration(expiresAt)
            .signWith(signingKey)
            .compact();
    }

    public AuthenticatedUser parseUser(String token) {
        Claims claims = parseClaims(token);
        return new AuthenticatedUser(
            claims.get("uid", Long.class),
            claims.getSubject(),
            claims.get("name", String.class),
            Role.valueOf(claims.get("role", String.class))
        );
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
