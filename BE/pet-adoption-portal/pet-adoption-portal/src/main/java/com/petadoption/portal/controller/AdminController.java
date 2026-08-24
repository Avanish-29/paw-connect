package com.petadoption.portal.controller;

import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.request.UpdateUserStatusRequest;
import com.petadoption.portal.dto.response.AdminDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.dto.response.UserResponse;
import com.petadoption.portal.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> users() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus()));
    }

    @GetMapping("/pets")
    public ResponseEntity<PageResponse<PetResponse>> pets(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminService.getPets(new PetSearchCriteria(), pageable));
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        adminService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/adoption-requests")
    public ResponseEntity<List<AdoptionRequestResponse>> requests() {
        return ResponseEntity.ok(adminService.getAdoptionRequests());
    }
}
