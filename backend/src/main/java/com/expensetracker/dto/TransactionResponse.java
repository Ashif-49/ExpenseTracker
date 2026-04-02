package com.expensetracker.dto;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.Transaction.TransactionType;
import lombok.*;
import java.math.BigDecimal;
import java.time.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionResponse {

    private Long id;
    private TransactionType type;
    private String category;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private LocalDateTime createdAt;

    // Static factory method: converts a Transaction entity to this DTO
    public static TransactionResponse from(Transaction t) {
        return TransactionResponse.builder()
            .id(t.getId())
            .type(t.getType())
            .category(t.getCategory())
            .amount(t.getAmount())
            .description(t.getDescription())
            .date(t.getDate())
            .createdAt(t.getCreatedAt())
            .build();
    }
}