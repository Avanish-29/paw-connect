package com.petadoption.portal.util;

import com.petadoption.portal.exception.UnauthorizedException;
import com.petadoption.portal.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static CustomUserDetails currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            throw new UnauthorizedException("Authentication is required");
        }
        return details;
    }

    public static Long currentUserId() {
        return currentUser().getId();
    }
}
