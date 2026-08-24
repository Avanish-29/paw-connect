package com.petadoption.portal.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
    private String name;

    @Pattern(regexp = "^$|^[0-9]{10,15}$", message = "Phone must be 10 to 15 digits")
    private String phone;

    @Size(max = 120, message = "Location must be at most 120 characters")
    private String location;
}
