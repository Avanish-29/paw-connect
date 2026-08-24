package com.petadoption.portal.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
public class OwnerDashboardResponse {

    private long myPets;
    private long availablePets;
    private long adoptedPets;
    private long pendingRequests;
    private List<PetResponse> recentPets;
    private List<AdoptionRequestResponse> recentRequests;

    public static OwnerDashboardResponse of(
            long myPets,
            long availablePets,
            long adoptedPets,
            long pendingRequests,
            Page<PetResponse> pets,
            List<AdoptionRequestResponse> requests) {
        return OwnerDashboardResponse.builder()
                .myPets(myPets)
                .availablePets(availablePets)
                .adoptedPets(adoptedPets)
                .pendingRequests(pendingRequests)
                .recentPets(pets.getContent())
                .recentRequests(requests)
                .build();
    }
}
