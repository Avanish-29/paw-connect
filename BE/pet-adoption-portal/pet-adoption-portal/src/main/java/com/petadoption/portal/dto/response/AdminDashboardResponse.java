package com.petadoption.portal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalOwners;
    private long totalAdopters;
    private long totalPets;
    private long availablePets;
    private long adoptedPets;
    private long pendingRequests;
}
