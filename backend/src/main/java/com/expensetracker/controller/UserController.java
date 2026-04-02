package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;

    // PUT /api/user/profile  --- update name
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateNameRequest req) {

        User user = userRepo.findByEmail(userDetails.getUsername())
            .orElseThrow();
        user.setName(req.getName());
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // PUT /api/user/password  --- change password
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePasswordRequest req) {

        User user = userRepo.findByEmail(userDetails.getUsername())
            .orElseThrow();

        // Verify current password
        if (!encoder.matches(req.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Current password is incorrect"));
        }

        user.setPassword(encoder.encode(req.getNewPassword()));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // ── Request DTOs ────────────────────────────────────────

    @Getter @Setter
    public static class UpdateNameRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100)
        private String name;
    }

    @Getter @Setter
    public static class UpdatePasswordRequest {
        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String newPassword;
    }
}