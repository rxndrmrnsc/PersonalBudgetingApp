package com.budgeting.backend.service;

import com.budgeting.backend.model.entity.Budget;
import com.budgeting.backend.model.entity.BudgetItem;
import com.budgeting.backend.model.enums.Month;
import com.budgeting.backend.repository.BudgetRepository;
import com.budgeting.backend.resource.BudgetResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAll() {
        // addBudget();
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
        Optional<Budget> byId = budgetRepository.findById(id);
        return byId
                .map(budget -> {
                    budget.setTitle(updatedBudget.getTitle());
                    budget.setYear(updatedBudget.getYear());
                    budget.setMonth(updatedBudget.getMonth());
                    budget.setIncomes(updatedBudget.getIncomes());
                    budget.setExpenses(updatedBudget.getExpenses());
                    budget.setSavings(updatedBudget.getSavings());
                    budgetRepository.save(budget);
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
                .title("December Budget")
                .year(2025)
                .month(Month.DECEMBER)
                .creationDate(LocalDateTime.now())
                .incomes(List.of(
                        BudgetItem.builder().name("Salariu").actual(5000).expected(5000).build(),
                        BudgetItem.builder().name("Bonuri de masa").actual(500).expected(250).build()
                ))
                .expenses(new Budget.Expenses(
                        List.of(
                                BudgetItem.builder().name("Chirie").actual(2000).expected(2000).build(),
                                BudgetItem.builder().name("Mancare").actual(500).expected(1250).build()
                        ),
                        List.of(
                                BudgetItem.builder().name("Haine").actual(150).expected(50).build(),
                                BudgetItem.builder().name("Iesiri").actual(500).expected(250).build()
                        )
                ))
                .savings(List.of(
                        BudgetItem.builder().name("Depozit").actual(500).expected(500).build(),
                        BudgetItem.builder().name("Cont economii").actual(0).expected(250).build()
                ))
                .build();
        budgetRepository.save(budget);
    }
}
