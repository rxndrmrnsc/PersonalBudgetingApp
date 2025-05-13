package com.budgeting.backend.model.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document("Budget")
public class Budget {
    @Id
    private String id;

    private String title;
    private String month; // e.g. "January"
    private int year;
}

