package com.petadoption.portal.dto.request;

import com.petadoption.portal.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 180)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
    private String password;

    @Pattern(regexp = "^$|^[0-9]{10,15}$", message = "Phone must be 10 to 15 digits")
    private String phone;

    @Size(max = 120, message = "Location must be at most 120 characters")
    private String location;

    @NotNull(message = "Role is required")
    private Role role;
}
