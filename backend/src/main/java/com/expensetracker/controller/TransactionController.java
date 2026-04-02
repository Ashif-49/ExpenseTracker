package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired private TransactionService service;

    // GET /api/dashboard/summary
    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummary> summary(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(service.getSummary(u.getUsername()));
    }

    // GET /api/dashboard/monthly?year=2026
    @GetMapping("/dashboard/monthly")
    public ResponseEntity<List<Map<String,Object>>> monthly(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year) {
        return ResponseEntity.ok(service.getMonthlySummary(u.getUsername(), year));
    }

    // GET /api/dashboard/categories
    @GetMapping("/dashboard/categories")
    public ResponseEntity<List<Map<String,Object>>> categories(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(service.getCategoryBreakdown(u.getUsername()));
    }

    // GET /api/transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getAll(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(service.getAll(u.getUsername()));
    }

    // GET /api/transactions/filter?type=EXPENSE&category=Food&from=2026-01-01&to=2026-12-31&keyword=dinner
    @GetMapping("/transactions/filter")
    public ResponseEntity<List<TransactionResponse>> filter(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(service.filter(u.getUsername(), type, category, from, to, keyword));
    }

    // POST /api/transactions
    @PostMapping("/transactions")
    public ResponseEntity<TransactionResponse> create(
            @AuthenticationPrincipal UserDetails u,
            @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(service.create(u.getUsername(), req));
    }

    // PUT /api/transactions/{id}
    @PutMapping("/transactions/{id}")
    public ResponseEntity<TransactionResponse> update(
            @AuthenticationPrincipal UserDetails u,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(service.update(u.getUsername(), id, req));
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Map<String,String>> delete(
            @AuthenticationPrincipal UserDetails u,
            @PathVariable Long id) {
        service.delete(u.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }
}