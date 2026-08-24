package com.petadoption.portal.service;

import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.response.AdminDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.dto.response.UserResponse;
import com.petadoption.portal.enums.UserStatus;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    AdminDashboardResponse getDashboard();

    List<UserResponse> getUsers();

    UserResponse updateUserStatus(Long userId, UserStatus status);

    PageResponse<PetResponse> getPets(PetSearchCriteria criteria, Pageable pageable);

    void deletePet(Long petId);

    List<AdoptionRequestResponse> getAdoptionRequests();
}
