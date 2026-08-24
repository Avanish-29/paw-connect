package com.petadoption.portal.controller;

import com.petadoption.portal.dto.request.PetCreateRequest;
import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.request.PetUpdateRequest;
import com.petadoption.portal.dto.request.RejectAdoptionRequest;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.dto.response.OwnerDashboardResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.service.AdoptionRequestService;
import com.petadoption.portal.service.PetService;
import com.petadoption.portal.util.SecurityUtils;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final PetService petService;
    private final AdoptionRequestService adoptionRequestService;

    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardResponse> dashboard() {
        return ResponseEntity.ok(petService.getOwnerDashboard(SecurityUtils.currentUserId()));
    }

    @PostMapping("/pets")
    public ResponseEntity<PetResponse> createPet(@Valid @RequestBody PetCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(petService.createPet(SecurityUtils.currentUserId(), request));
    }

    @GetMapping("/pets")
    public ResponseEntity<PageResponse<PetResponse>> getPets(@PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(petService.getOwnerPets(
                SecurityUtils.currentUserId(), new PetSearchCriteria(), pageable));
    }

    @PutMapping("/pets/{id}")
    public ResponseEntity<PetResponse> updatePet(
            @PathVariable Long id,
            @Valid @RequestBody PetUpdateRequest request) {
        return ResponseEntity.ok(petService.updatePet(id, SecurityUtils.currentUserId(), request));
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id, SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/adoption-requests")
    public ResponseEntity<List<AdoptionRequestResponse>> getRequests() {
        return ResponseEntity.ok(adoptionRequestService.getOwnerRequests(SecurityUtils.currentUserId()));
    }

    @PatchMapping("/adoption-requests/{id}/approve")
    public ResponseEntity<AdoptionRequestResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adoptionRequestService.approveRequest(id, SecurityUtils.currentUserId()));
    }

    @PatchMapping("/adoption-requests/{id}/reject")
    public ResponseEntity<AdoptionRequestResponse> reject(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) RejectAdoptionRequest request) {
        String note = request == null ? null : request.getOwnerNote();
        return ResponseEntity.ok(adoptionRequestService.rejectRequest(id, SecurityUtils.currentUserId(), note));
    }
}
