package com.budgeting.backend.model.entity;

import lombok.Builder;

@Builder
public record BudgetItem(String name, double expected, double actual) {
}

