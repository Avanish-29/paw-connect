package com.petadoption.portal.dto.response;

import com.petadoption.portal.enums.AdoptionRequestStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdoptionRequestResponse {

    private Long id;
    private PetSummaryResponse pet;
    private UserResponse adopter;
    private String message;
    private AdoptionRequestStatus status;
    private String ownerNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
