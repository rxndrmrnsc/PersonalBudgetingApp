package com.budgeting.backend.model.entity;

import com.budgeting.backend.model.enums.Month;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@Document("Budget")
public class Budget {
    @Id
    private String id;

    private String userId;
    private LocalDateTime creationDate;
    private String title;
    private Month month; // e.g. "January"
    private int year;

    private List<BudgetItem> incomes;
    private Expenses expenses;
    private List<BudgetItem> savings;

    public record Expenses(List<BudgetItem> needs,
                           List<BudgetItem> expenses) {}
}

