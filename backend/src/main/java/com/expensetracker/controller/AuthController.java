package com.expensetracker.controller;

import com.expensetracker.dto.AuthDTOs.*;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtils jwtUtils;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email is already in use"));
        }

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword())) // Encrypt password!
            .build();

        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        // Spring Security checks email + password automatically
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        String token = jwtUtils.generateToken(auth);
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
            .token(token).type("Bearer")
            .id(user.getId()).name(user.getName()).email(user.getEmail())
            .build());
    }
}