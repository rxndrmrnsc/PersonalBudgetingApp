package com.budgeting.backend.resource;

import com.budgeting.backend.model.CustomUserDetails;
import com.budgeting.backend.model.entity.Budget;
import com.budgeting.backend.security.SecurityUtils;
import com.budgeting.backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{userId}/budgets")
public class BudgetResource {

    @Autowired
    private final BudgetService budgetService;
    @Autowired
    private final SecurityUtils securityUtils;

    public BudgetResource(BudgetService budgetService, SecurityUtils securityUtils) {
        this.budgetService = budgetService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public List<Budget> getAllBudgets(
            @PathVariable String userId
    ) {
        securityUtils.checkUserAccess(userId);
        return budgetService.getAll(userId);
    }

    @GetMapping("/{budgetId}")
    public ResponseEntity<Budget> getBudgetById(
            @PathVariable String userId,
            @PathVariable String budgetId) {
        securityUtils.checkUserAccess(userId);
        return budgetService.getById(userId, budgetId);
    }

    // POST create new budget
    @PostMapping
    public Budget createBudget(
            @PathVariable String userId,
            @RequestBody Budget budget) {
        securityUtils.checkUserAccess(userId);
        return budgetService.create(userId, budget);
    }

    // PUT update budget
    @PutMapping("/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable String userId,
            @PathVariable String budgetId,
            @RequestBody Budget updatedBudget) {
        securityUtils.checkUserAccess(userId);
        return budgetService.update(userId, budgetId, updatedBudget);
    }

    // DELETE budget
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable String userId,
            @PathVariable String budgetId) {
        securityUtils.checkUserAccess(userId);
        return budgetService.delete(userId, budgetId);
    }
}
