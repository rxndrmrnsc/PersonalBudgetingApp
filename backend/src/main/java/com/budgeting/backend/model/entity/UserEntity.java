package com.budgeting.backend.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("User")
public class UserEntity {
    @Id
    private String id;
    private String username;
    private String password;
}