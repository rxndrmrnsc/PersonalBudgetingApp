package com.budgeting.backend.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String userId;
    private String message;

    public LoginResponse(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }
}
