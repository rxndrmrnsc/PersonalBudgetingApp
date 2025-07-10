package com.budgeting.backend.security;

import com.budgeting.backend.model.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


@Component
public class SecurityUtils {

    /**
     * Checks if the authenticated user's ID matches the provided user ID.
     * Throws AccessDeniedException if they do not match or if the user is not authenticated.
     *
     * @param requestedUserId The user ID from the request (e.g., path variable).
     */
    public void checkUserAccess(String requestedUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            // This case should ideally be caught by Spring Security's authorizeHttpRequests
            // before reaching this point, but it's good for robustness.
            throw new AccessDeniedException("User is not authenticated.");
        }

        Object principal = authentication.getPrincipal();
        String authenticatedUserId = null;

        // --- IMPORTANT: How to get the authenticated user's ID ---
        if (principal instanceof CustomUserDetails) {
            // RECOMMENDED: If you have a custom UserDetails that stores the userId
            authenticatedUserId = ((CustomUserDetails) principal).getUserId();
        } else if (principal instanceof UserDetails) {
            // Fallback: If Spring's default UserDetails is used and username IS the ID
            authenticatedUserId = ((UserDetails) principal).getUsername();
        } else {
            // Handle unexpected principal type
            throw new AccessDeniedException("Could not determine authenticated user ID from principal.");
        }

        // Compare the authenticated user's ID with the requested user ID
        if (authenticatedUserId == null || !authenticatedUserId.equals(requestedUserId)) {
            throw new AccessDeniedException("Access denied: User ID mismatch.");
        }
    }

    /**
     * Retrieves the authenticated user's ID from the SecurityContext.
     *
     * @return The authenticated user's ID.
     * @throws AccessDeniedException if the user is not authenticated or ID cannot be retrieved.
     */
    public String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated.");
        }

        Object principal = authentication.getPrincipal();
        String authenticatedUserId = null;

        if (principal instanceof CustomUserDetails) {
            authenticatedUserId = ((CustomUserDetails) principal).getUserId();
        } else if (principal instanceof UserDetails) {
            authenticatedUserId = ((UserDetails) principal).getUsername();
        } else {
            throw new AccessDeniedException("Could not determine authenticated user ID from principal.");
        }

        if (authenticatedUserId == null) {
            throw new AccessDeniedException("Authenticated user ID is null.");
        }
        return authenticatedUserId;
    }
}