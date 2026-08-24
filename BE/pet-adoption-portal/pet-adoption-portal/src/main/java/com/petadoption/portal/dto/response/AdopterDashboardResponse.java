package com.petadoption.portal.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdopterDashboardResponse {

    private long totalRequests;
    private long pending;
    private long approved;
    private long rejected;
    private List<AdoptionRequestResponse> recentRequests;
}
