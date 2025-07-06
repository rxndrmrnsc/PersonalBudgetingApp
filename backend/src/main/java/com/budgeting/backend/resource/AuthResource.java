package com.budgeting.backend.resource;

import com.budgeting.backend.model.entity.UserEntity;
import com.budgeting.backend.service.UserAuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthResource {

    private final UserAuthenticationService userAuthenticationService;

    public AuthResource(UserAuthenticationService userAuthenticationService) {
        this.userAuthenticationService = userAuthenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestBody UserEntity userEntity
    ) {
        userAuthenticationService.registerUser(userEntity);
        return ResponseEntity.noContent().build();
    }
}