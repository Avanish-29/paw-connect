package com.petadoption.portal.dto.request;

import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Species;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetUpdateRequest {

    @Size(max = 80, message = "Pet name must be at most 80 characters")
    private String name;

    private Species species;

    @Size(max = 80, message = "Breed must be at most 80 characters")
    private String breed;

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 40, message = "Age must be 40 or less")
    private Integer age;

    private Gender gender;

    private HealthStatus healthStatus;

    @Size(max = 120)
    private String location;

    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    @Size(max = 1000, message = "Image URL must be at most 1000 characters")
    private String imageUrl;

    private Availability availability;
}
