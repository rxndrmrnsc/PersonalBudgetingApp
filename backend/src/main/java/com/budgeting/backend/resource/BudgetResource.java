package com.budgeting.backend.resource;

import com.budgeting.backend.model.entity.Budget;
import com.budgeting.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{userId}/budgets")
@CrossOrigin(origins = "*") // Allow CORS
public class BudgetResource {

    @Autowired
    private final BudgetService budgetService;

    public BudgetResource(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // GET all budgets
    @GetMapping
    public List<Budget> getAllBudgets(
            @PathVariable String userId
    ) {
        return budgetService.getAll(userId);
    }

    // GET one budget by ID
    @GetMapping("/{budgetId}")
    public ResponseEntity<Budget> getBudgetById(
            @PathVariable String userId,
            @PathVariable String budgetId) {
        return budgetService.getById(userId, budgetId);
    }

    // POST create new budget
    @PostMapping
    public Budget createBudget(
            @PathVariable String userId,
            @RequestBody Budget budget) {
        return budgetService.create(budget);
    }

    // PUT update budget
    @PutMapping("/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable String userId,
            @PathVariable String budgetId,
            @RequestBody Budget updatedBudget) {
        return budgetService.update(userId, budgetId, updatedBudget);
    }

    // DELETE budget
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable String userId,
            @PathVariable String budgetId) {
        return budgetService.delete(userId, budgetId);
    }

}
