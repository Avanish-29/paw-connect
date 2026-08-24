package com.petadoption.portal.service.impl;

import com.petadoption.portal.dto.request.AdoptionRequestCreateRequest;
import com.petadoption.portal.dto.response.AdopterDashboardResponse;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.entity.AdoptionRequest;
import com.petadoption.portal.entity.Pet;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.AdoptionRequestStatus;
import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.exception.BadRequestException;
import com.petadoption.portal.exception.DuplicateResourceException;
import com.petadoption.portal.exception.ForbiddenException;
import com.petadoption.portal.exception.ResourceNotFoundException;
import com.petadoption.portal.mapper.AdoptionRequestMapper;
import com.petadoption.portal.repository.AdoptionRequestRepository;
import com.petadoption.portal.repository.PetRepository;
import com.petadoption.portal.repository.UserRepository;
import com.petadoption.portal.service.AdoptionRequestService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final AdoptionRequestMapper adoptionRequestMapper;

    @Override
    public AdoptionRequestResponse createRequest(Long adopterId, AdoptionRequestCreateRequest request) {
        User adopter = userRepository.findById(adopterId)
                .orElseThrow(() -> new ResourceNotFoundException("Adopter not found"));
        Pet pet = petRepository.findWithDetailsById(request.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));

        if (pet.getOwner().getId().equals(adopterId)) {
            throw new BadRequestException("You cannot adopt your own pet");
        }
        if (pet.getAvailability() != Availability.AVAILABLE) {
            log.warn("Adoption request blocked because pet {} is no longer available", pet.getId());
            throw new BadRequestException("Pet is no longer available");
        }
        if (adoptionRequestRepository.existsByPetIdAndAdopterIdAndStatus(
                pet.getId(), adopterId, AdoptionRequestStatus.PENDING)) {
            log.warn("Duplicate pending adoption request for petId={} adopterId={}", pet.getId(), adopterId);
            throw new DuplicateResourceException("You already have a pending request for this pet");
        }

        AdoptionRequest adoptionRequest = AdoptionRequest.builder()
                .pet(pet)
                .adopter(adopter)
                .message(request.getMessage().trim())
                .status(AdoptionRequestStatus.PENDING)
                .build();
        AdoptionRequest saved = adoptionRequestRepository.save(adoptionRequest);
        log.info("Created adoption request id={} for petId={} by adopterId={}",
                saved.getId(), pet.getId(), adopterId);
        return adoptionRequestMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getAdopterRequests(Long adopterId) {
        log.debug("Listing adoption requests for adopterId={}", adopterId);
        return adoptionRequestRepository.findByAdopterIdOrderByCreatedAtDesc(adopterId).stream()
                .map(adoptionRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getOwnerRequests(Long ownerId) {
        log.debug("Listing adoption requests for ownerId={}", ownerId);
        return adoptionRequestRepository.findByPetOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(adoptionRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getAllRequests() {
        return adoptionRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(adoptionRequestMapper::toResponse)
                .toList();
    }

    @Override
    public AdoptionRequestResponse approveRequest(Long requestId, Long ownerId) {
        AdoptionRequest request = getOwnedPendingRequest(requestId, ownerId);
        Pet pet = request.getPet();
        if (pet.getAvailability() != Availability.AVAILABLE && pet.getAvailability() != Availability.PENDING) {
            throw new BadRequestException("Pet is no longer available for adoption");
        }

        request.setStatus(AdoptionRequestStatus.APPROVED);
        pet.setAvailability(Availability.ADOPTED);

        List<AdoptionRequest> others = adoptionRequestRepository.findByPetIdAndStatus(
                pet.getId(), AdoptionRequestStatus.PENDING);
        others.stream()
                .filter(other -> !other.getId().equals(request.getId()))
                .forEach(other -> {
                    other.setStatus(AdoptionRequestStatus.REJECTED);
                    other.setOwnerNote("Another adopter was selected for this pet");
                });

        log.info("Approved adoption request id={} petId={} now ADOPTED; rejected {} competing requests",
                requestId, pet.getId(), Math.max(others.size() - 1, 0));
        return adoptionRequestMapper.toResponse(request);
    }

    @Override
    public AdoptionRequestResponse rejectRequest(Long requestId, Long ownerId, String ownerNote) {
        AdoptionRequest request = getOwnedPendingRequest(requestId, ownerId);
        request.setStatus(AdoptionRequestStatus.REJECTED);
        request.setOwnerNote(ownerNote);
        log.warn("Adoption request {} was rejected", requestId);
        return adoptionRequestMapper.toResponse(request);
    }

    @Override
    public AdoptionRequestResponse cancelRequest(Long requestId, Long adopterId) {
        AdoptionRequest request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found"));
        if (!request.getAdopter().getId().equals(adopterId)) {
            throw new ForbiddenException("You can only cancel your own requests");
        }
        if (request.getStatus() != AdoptionRequestStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be cancelled");
        }
        request.setStatus(AdoptionRequestStatus.CANCELLED);
        log.info("Cancelled adoption request id={} by adopterId={}", requestId, adopterId);
        return adoptionRequestMapper.toResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public AdopterDashboardResponse getAdopterDashboard(Long adopterId) {
        return AdopterDashboardResponse.builder()
                .totalRequests(adoptionRequestRepository.countByAdopterId(adopterId))
                .pending(adoptionRequestRepository.countByAdopterIdAndStatus(adopterId, AdoptionRequestStatus.PENDING))
                .approved(adoptionRequestRepository.countByAdopterIdAndStatus(adopterId, AdoptionRequestStatus.APPROVED))
                .rejected(adoptionRequestRepository.countByAdopterIdAndStatus(adopterId, AdoptionRequestStatus.REJECTED))
                .recentRequests(getAdopterRequests(adopterId))
                .build();
    }

    private AdoptionRequest getOwnedPendingRequest(Long requestId, Long ownerId) {
        AdoptionRequest request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found"));
        if (!request.getPet().getOwner().getId().equals(ownerId)) {
            log.warn("Owner {} attempted to review request {} for another owner's pet", ownerId, requestId);
            throw new ForbiddenException("You can only review requests for your own pets");
        }
        if (request.getStatus() != AdoptionRequestStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be reviewed");
        }
        return request;
    }
}
