package com.budgeting.backend.service;

import com.budgeting.backend.model.entity.Budget;
import com.budgeting.backend.repository.BudgetRepository;
import com.budgeting.backend.resource.BudgetResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAll() {
        addBudget();
        return budgetRepository.findAll();
    }

    public ResponseEntity<Budget> getById(String id) {
        return budgetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public Budget create(Budget budget, BudgetResource budgetResource) {
        return budgetRepository.save(budget);
    }

    public ResponseEntity<Budget> update(String id, Budget updatedBudget, BudgetResource budgetResource) {
        return budgetRepository.findById(id)
                .map(budget -> {
                    budget.setTitle(updatedBudget.getTitle());
                    budget.setMonth(updatedBudget.getMonth());
                    budget.setYear(updatedBudget.getYear());
                    // Add other field updates here
                    return ResponseEntity.ok(create(budget, budgetResource));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> delete(String id) {
        if (!budgetRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        budgetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public void addBudget() {
        Budget budget = Budget.builder()
                .title("January Budget")
                .year(2025)
                .month("January")
                .build();
    }
}
