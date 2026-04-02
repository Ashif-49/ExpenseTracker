package com.expensetracker.dto;

import com.expensetracker.model.Transaction.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionRequest {

    @NotNull(message = "Type must be INCOME or EXPENSE")
    private TransactionType type;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;

    @Size(max = 255)
    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;
}