package com.petadoption.portal.mapper;

import com.petadoption.portal.dto.request.RegisterRequest;
import com.petadoption.portal.dto.request.UpdateProfileRequest;
import com.petadoption.portal.dto.response.UserResponse;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.UserStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String encodedPassword) {
        return User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(encodedPassword)
                .phone(blankToNull(request.getPhone()))
                .location(blankToNull(request.getLocation()))
                .role(request.getRole())
                .status(UserStatus.ACTIVE)
                .build();
    }

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .location(user.getLocation())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public void updateEntity(User user, UpdateProfileRequest request) {
        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(blankToNull(request.getPhone()));
        }
        if (request.getLocation() != null) {
            user.setLocation(blankToNull(request.getLocation()));
        }
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
