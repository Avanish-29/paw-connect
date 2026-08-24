package com.petadoption.portal.service;

import com.petadoption.portal.dto.request.PetCreateRequest;
import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.request.PetUpdateRequest;
import com.petadoption.portal.dto.response.OwnerDashboardResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import org.springframework.data.domain.Pageable;

public interface PetService {

    PetResponse createPet(Long ownerId, PetCreateRequest request);

    PetResponse getPetById(Long id);

    PageResponse<PetResponse> getPets(PetSearchCriteria criteria, Pageable pageable);

    PageResponse<PetResponse> getOwnerPets(Long ownerId, PetSearchCriteria criteria, Pageable pageable);

    PetResponse updatePet(Long petId, Long ownerId, PetUpdateRequest request);

    void deletePet(Long petId, Long ownerId);

    OwnerDashboardResponse getOwnerDashboard(Long ownerId);
}
