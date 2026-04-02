package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // All transactions for a user, newest first
    List<Transaction> findByUserIdOrderByDateDescCreatedAtDesc(Long userId);

    // Find ONE transaction that belongs to a specific user (security check)
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    // Count transactions for a user
    long countByUserId(Long userId);

    // Sum all INCOME for a user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :uid AND t.type = 'INCOME'")
    BigDecimal sumIncome(@Param("uid") Long userId);

    // Sum all EXPENSES for a user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :uid AND t.type = 'EXPENSE'")
    BigDecimal sumExpenses(@Param("uid") Long userId);

    // Filter transactions (all filters are optional)
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :uid
        AND (:type IS NULL OR t.type = :type)
        AND (:cat IS NULL OR LOWER(t.category) = LOWER(:cat))
        AND (:from IS NULL OR t.date >= :from)
        AND (:to IS NULL OR t.date <= :to)
        AND (:kw IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%',:kw,'%')))
        ORDER BY t.date DESC, t.createdAt DESC
        """)
    List<Transaction> filter(
        @Param("uid") Long userId,
        @Param("type") TransactionType type,
        @Param("cat") String category,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("kw") String keyword
    );

    // Monthly summary: month, year, type, total
    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, SUM(t.amount) " +
           "FROM Transaction t WHERE t.user.id = :uid AND YEAR(t.date) = :year " +
           "GROUP BY YEAR(t.date), MONTH(t.date), t.type ORDER BY MONTH(t.date)")
    List<Object[]> monthlySummary(@Param("uid") Long userId, @Param("year") int year);

    // Category breakdown for expenses
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = 'EXPENSE' GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> categoryBreakdown(@Param("uid") Long userId);
}