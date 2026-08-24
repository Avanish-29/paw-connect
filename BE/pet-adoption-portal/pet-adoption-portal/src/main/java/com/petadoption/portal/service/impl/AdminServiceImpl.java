package com.petadoption.portal.service.impl;

import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.response.AdminDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.dto.response.UserResponse;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.AdoptionRequestStatus;
import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Role;
import com.petadoption.portal.enums.UserStatus;
import com.petadoption.portal.exception.BadRequestException;
import com.petadoption.portal.exception.ResourceNotFoundException;
import com.petadoption.portal.mapper.AdoptionRequestMapper;
import com.petadoption.portal.mapper.PetMapper;
import com.petadoption.portal.mapper.UserMapper;
import com.petadoption.portal.repository.AdoptionRequestRepository;
import com.petadoption.portal.repository.PetRepository;
import com.petadoption.portal.repository.UserRepository;
import com.petadoption.portal.service.AdminService;
import com.petadoption.portal.specification.PetSpecification;
import com.petadoption.portal.util.PageMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;
    private final UserMapper userMapper;
    private final PetMapper petMapper;
    private final AdoptionRequestMapper adoptionRequestMapper;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        log.debug("Building admin dashboard");
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalOwners(userRepository.countByRole(Role.OWNER))
                .totalAdopters(userRepository.countByRole(Role.ADOPTER))
                .totalPets(petRepository.count())
                .availablePets(petRepository.countByAvailability(Availability.AVAILABLE))
                .adoptedPets(petRepository.countByAvailability(Availability.ADOPTED))
                .pendingRequests(adoptionRequestRepository.countByStatus(AdoptionRequestStatus.PENDING))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    @Override
    public UserResponse updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin status cannot be changed");
        }
        user.setStatus(status);
        log.info("Admin updated userId={} status={}", userId, status);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PetResponse> getPets(PetSearchCriteria criteria, Pageable pageable) {
        return PageMapper.toResponse(petRepository.findAll(PetSpecification.from(criteria), pageable)
                .map(pet -> petMapper.toResponse(pet,
                        adoptionRequestRepository.countByPetIdAndStatus(pet.getId(), AdoptionRequestStatus.PENDING))));
    }

    @Override
    public void deletePet(Long petId) {
        if (!petRepository.existsById(petId)) {
            throw new ResourceNotFoundException("Pet not found");
        }
        adoptionRequestRepository.deleteByPetId(petId);
        petRepository.deleteById(petId);
        log.info("Admin deleted pet id={}", petId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getAdoptionRequests() {
        return adoptionRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(adoptionRequestMapper::toResponse)
                .toList();
    }
}
