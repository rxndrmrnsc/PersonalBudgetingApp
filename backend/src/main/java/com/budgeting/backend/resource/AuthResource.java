package com.budgeting.backend.resource;

import com.budgeting.backend.model.CustomUserDetails;
import com.budgeting.backend.model.entity.UserEntity;
import com.budgeting.backend.model.response.LoginResponse;
import com.budgeting.backend.service.UserAuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthResource {

    private final UserAuthenticationService userAuthenticationService;
    private final AuthenticationManager authenticationManager;

    public AuthResource(UserAuthenticationService userAuthenticationService, AuthenticationManager authenticationManager) {
        this.userAuthenticationService = userAuthenticationService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping(value = "/register", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> register(
            @RequestBody UserEntity userEntity
    ) {
        try {
            String id = userAuthenticationService.registerUser(userEntity);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> login(@RequestBody UserEntity userEntity) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userEntity.getUsername(), userEntity.getPassword())
            );

            // 2. Set the authenticated user in the SecurityContext (optional, but good practice for session-based auth)
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Retrieve the UserDetails (which should contain your user ID)
            // Assuming your UserAuthenticationService or custom UserDetails implementation
            // provides a way to get the user ID.
            // If your UserDetails is a custom class like MyCustomUserDetails implements UserDetails,
            // you can cast it and get the ID.
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // --- IMPORTANT: How to get the User ID ---
            String userId = null;
            // Option A: If your UserAuthenticationService has a method to get ID by username
            // userId = userAuthenticationService.getUserIdByUsername(userEntity.getUsername());

            // Option B: If your UserDetails implementation contains the ID (RECOMMENDED)
            // For example, if your custom UserDetails class has a getUserId() method:
            if (userDetails instanceof CustomUserDetails) { // Replace CustomUserDetails
                userId = ((CustomUserDetails) userDetails).getUserId();
            } else {
                // Fallback or error if UserDetails doesn't directly contain ID
                // You might need to load the UserEntity again if ID is not in UserDetails
                // For simplicity, let's assume username is the ID if no custom UserDetails
                userId = userDetails.getUsername(); // Or fetch from DB if needed
            }
            // --- End of IMPORTANT ---

            return ResponseEntity.ok(new LoginResponse(userId, "Login successful!"));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, "Invalid username or password."));
        } catch (Exception e) {
            System.err.println("Error during user login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(null, "An unexpected error occurred."));
        }
    }
}