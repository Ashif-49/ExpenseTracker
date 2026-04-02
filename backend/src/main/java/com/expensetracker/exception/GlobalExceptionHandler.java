package com.expensetracker.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice // Catches exceptions from ALL controllers
public class GlobalExceptionHandler {

    // Validation errors (@Valid failed)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(e -> {
            fieldErrors.put(((FieldError)e).getField(), e.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(error(400, "Validation failed", fieldErrors));
    }

    // Entity not found
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(404).body(error(404, ex.getMessage(), null));
    }

    // Wrong password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> handleBadCreds(BadCredentialsException ex) {
        return ResponseEntity.status(401).body(error(401, "Invalid email or password", null));
    }

    // All other errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleAll(Exception ex) {
        return ResponseEntity.status(500).body(error(500, "An unexpected error occurred", null));
    }

    private Map<String,Object> error(int status, String message, Object details) {
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("message", message);
        if (details != null) body.put("details", details);
        return body;
    }
}