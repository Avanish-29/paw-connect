package com.petadoption.portal.dto.response;

import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Species;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetResponse {

    private Long id;
    private String name;
    private Species species;
    private String breed;
    private Integer age;
    private Gender gender;
    private HealthStatus healthStatus;
    private String location;
    private String description;
    private Availability availability;
    private String primaryImageUrl;
    private List<PetImageResponse> images;
    private UserResponse owner;
    private long pendingRequestCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
