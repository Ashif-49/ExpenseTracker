package com.expensetracker.service;

import com.expensetracker.dto.*;
import com.expensetracker.model.*;
import com.expensetracker.model.Transaction.TransactionType;
import com.expensetracker.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    @Autowired private TransactionRepository txRepo;
    @Autowired private UserRepository userRepo;

    // ── CREATE ────────────────────────────────────────────
    public TransactionResponse create(String email, TransactionRequest req) {
        User user = getUser(email);
        Transaction t = Transaction.builder()
            .user(user).type(req.getType()).category(req.getCategory())
            .amount(req.getAmount()).description(req.getDescription())
            .date(req.getDate()).build();
        return TransactionResponse.from(txRepo.save(t));
    }

    // ── READ ALL ──────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAll(String email) {
        User user = getUser(email);
        return txRepo.findByUserIdOrderByDateDescCreatedAtDesc(user.getId())
            .stream().map(TransactionResponse::from).collect(Collectors.toList());
    }

    // ── FILTER ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<TransactionResponse> filter(String email, TransactionType type,
            String cat, LocalDate from, LocalDate to, String kw) {
        User user = getUser(email);
        return txRepo.filter(user.getId(), type, cat, from, to, kw)
            .stream().map(TransactionResponse::from).collect(Collectors.toList());
    }

    // ── UPDATE ────────────────────────────────────────────
    public TransactionResponse update(String email, Long id, TransactionRequest req) {
        User user = getUser(email);
        Transaction t = getTx(id, user.getId());
        t.setType(req.getType()); t.setCategory(req.getCategory());
        t.setAmount(req.getAmount()); t.setDescription(req.getDescription());
        t.setDate(req.getDate());
        return TransactionResponse.from(txRepo.save(t));
    }

    // ── DELETE ────────────────────────────────────────────
    public void delete(String email, Long id) {
        User user = getUser(email);
        txRepo.delete(getTx(id, user.getId()));
    }

    // ── DASHBOARD SUMMARY ─────────────────────────────────
    @Transactional(readOnly = true)
    public DashboardSummary getSummary(String email) {
        Long uid = getUser(email).getId();
        BigDecimal inc = txRepo.sumIncome(uid);
        BigDecimal exp = txRepo.sumExpenses(uid);
        return DashboardSummary.builder()
            .totalIncome(inc).totalExpenses(exp)
            .balance(inc.subtract(exp))
            .transactionCount(txRepo.countByUserId(uid)).build();
    }

    // ── MONTHLY SUMMARY ───────────────────────────────────
    @Transactional(readOnly = true)
    public List<Map<String,Object>> getMonthlySummary(String email, int year) {
        Long uid = getUser(email).getId();
        Map<Integer, Map<String,Object>> byMonth = new LinkedHashMap<>();
        for (Object[] row : txRepo.monthlySummary(uid, year)) {
            int month = ((Number)row[0]).intValue();
            String type = row[2].toString();
            BigDecimal amt = (BigDecimal) row[3];
            byMonth.computeIfAbsent(month, m -> {
                Map<String,Object> e = new LinkedHashMap<>();
                e.put("month", m); e.put("income", BigDecimal.ZERO); e.put("expense", BigDecimal.ZERO);
                return e;
            }).put(type.equals("INCOME") ? "income" : "expense", amt);
        }
        return new ArrayList<>(byMonth.values());
    }

    // ── CATEGORY BREAKDOWN ────────────────────────────────
    @Transactional(readOnly = true)
    public List<Map<String,Object>> getCategoryBreakdown(String email) {
        Long uid = getUser(email).getId();
        return txRepo.categoryBreakdown(uid).stream().map(row -> {
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("category", row[0]); m.put("amount", row[1]);
            return m;
        }).collect(Collectors.toList());
    }

    // ── PRIVATE HELPERS ───────────────────────────────────
    private User getUser(String email) {
        return userRepo.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
    }

    private Transaction getTx(Long id, Long userId) {
        return txRepo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new EntityNotFoundException("Transaction not found: " + id));
    }
}