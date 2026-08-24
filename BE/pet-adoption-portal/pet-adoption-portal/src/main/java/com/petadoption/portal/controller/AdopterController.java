package com.petadoption.portal.controller;

import com.petadoption.portal.dto.request.AdoptionRequestCreateRequest;
import com.petadoption.portal.dto.response.AdopterDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.service.AdoptionRequestService;
import com.petadoption.portal.util.SecurityUtils;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/adopter")
@RequiredArgsConstructor
public class AdopterController {

    private final AdoptionRequestService adoptionRequestService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdopterDashboardResponse> dashboard() {
        return ResponseEntity.ok(adoptionRequestService.getAdopterDashboard(SecurityUtils.currentUserId()));
    }

    @PostMapping("/adoption-requests")
    public ResponseEntity<AdoptionRequestResponse> create(
            @Valid @RequestBody AdoptionRequestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adoptionRequestService.createRequest(SecurityUtils.currentUserId(), request));
    }

    @GetMapping("/adoption-requests")
    public ResponseEntity<List<AdoptionRequestResponse>> list() {
        return ResponseEntity.ok(adoptionRequestService.getAdopterRequests(SecurityUtils.currentUserId()));
    }

    @PatchMapping("/adoption-requests/{id}/cancel")
    public ResponseEntity<AdoptionRequestResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(adoptionRequestService.cancelRequest(id, SecurityUtils.currentUserId()));
    }
}
