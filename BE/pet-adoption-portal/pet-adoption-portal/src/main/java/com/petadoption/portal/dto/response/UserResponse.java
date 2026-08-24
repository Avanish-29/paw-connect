package com.petadoption.portal.dto.response;

import com.petadoption.portal.enums.Role;
import com.petadoption.portal.enums.UserStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
}
