package com.budgeting.backend.resource;

import com.budgeting.backend.model.entity.Budget;
import com.budgeting.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*") // Allow CORS
public class BudgetResource {

    @Autowired
    private final BudgetService budgetService;

    public BudgetResource(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // GET all budgets
    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAll();
    }

    // GET one budget by ID
    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable String id) {
        return budgetService.getById(id);
    }

    // POST create new budget
    @PostMapping
    public Budget createBudget(@RequestBody Budget budget) {
        return budgetService.create(budget, this);
    }

    // PUT update budget
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable String id, @RequestBody Budget updatedBudget) {
        return budgetService.update(id, updatedBudget, this);
    }

    // DELETE budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String id) {
        return budgetService.delete(id);
    }

}
