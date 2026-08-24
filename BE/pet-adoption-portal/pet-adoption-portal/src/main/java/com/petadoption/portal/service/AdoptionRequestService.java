package com.petadoption.portal.service;

import com.petadoption.portal.dto.request.AdoptionRequestCreateRequest;
import com.petadoption.portal.dto.response.AdopterDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import java.util.List;

public interface AdoptionRequestService {

    AdoptionRequestResponse createRequest(Long adopterId, AdoptionRequestCreateRequest request);

    List<AdoptionRequestResponse> getAdopterRequests(Long adopterId);

    List<AdoptionRequestResponse> getOwnerRequests(Long ownerId);

    List<AdoptionRequestResponse> getAllRequests();

    AdoptionRequestResponse approveRequest(Long requestId, Long ownerId);

    AdoptionRequestResponse rejectRequest(Long requestId, Long ownerId, String ownerNote);

    AdoptionRequestResponse cancelRequest(Long requestId, Long adopterId);

    AdopterDashboardResponse getAdopterDashboard(Long adopterId);
}
