package com.budgeting.backend.repository;

import com.budgeting.backend.model.entity.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {
}

