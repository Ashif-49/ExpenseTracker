package com.expensetracker.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSummary {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance; // income - expenses
    private long transactionCount;
}