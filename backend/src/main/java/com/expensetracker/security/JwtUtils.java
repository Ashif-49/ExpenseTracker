package com.expensetracker.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.*;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    // Called after login --- creates a JWT token for the user
    public String generateToken(Authentication auth) {
        UserDetails user = (UserDetails) auth.getPrincipal();
        return Jwts.builder()
            .setSubject(user.getUsername()) // username = email
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    // Extract the email from a token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey())
            .build().parseClaimsJws(token).getBody().getSubject();
    }

    // Returns true if the token is valid and not expired
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false; // Token is invalid or expired
        }
    }

    private Key getKey() {
        byte[] bytes = Base64.getEncoder().encode(secret.getBytes());
        return Keys.hmacShaKeyFor(bytes);
    }
}