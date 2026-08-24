package com.petadoption.portal.service.impl;

import com.petadoption.portal.dto.request.PetCreateRequest;
import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.request.PetUpdateRequest;
import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.dto.response.OwnerDashboardResponse;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.entity.Pet;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.AdoptionRequestStatus;
import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Role;
import com.petadoption.portal.exception.ForbiddenException;
import com.petadoption.portal.exception.ResourceNotFoundException;
import com.petadoption.portal.mapper.AdoptionRequestMapper;
import com.petadoption.portal.mapper.PetMapper;
import com.petadoption.portal.repository.AdoptionRequestRepository;
import com.petadoption.portal.repository.PetRepository;
import com.petadoption.portal.repository.UserRepository;
import com.petadoption.portal.service.PetService;
import com.petadoption.portal.specification.PetSpecification;
import com.petadoption.portal.util.PageMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetMapper petMapper;
    private final AdoptionRequestMapper adoptionRequestMapper;

    @Override
    public PetResponse createPet(Long ownerId, PetCreateRequest request) {
        User owner = requireOwner(ownerId);
        Pet pet = petMapper.toEntity(request, owner);
        Pet saved = petRepository.save(pet);
        log.info("Created pet id={} for ownerId={}", saved.getId(), ownerId);
        return petMapper.toResponse(saved, 0);
    }

    @Override
    @Transactional(readOnly = true)
    public PetResponse getPetById(Long id) {
        log.debug("Fetching pet with id={}", id);
        Pet pet = petRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));
        long pending = adoptionRequestRepository.countByPetIdAndStatus(id, AdoptionRequestStatus.PENDING);
        return petMapper.toResponse(pet, pending);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PetResponse> getPets(PetSearchCriteria criteria, Pageable pageable) {
        log.debug("Searching pets with filters");
        Specification<Pet> specification = PetSpecification.from(criteria);
        Page<PetResponse> page = petRepository.findAll(specification, withDefaultSort(pageable))
                .map(pet -> petMapper.toResponse(pet,
                        adoptionRequestRepository.countByPetIdAndStatus(pet.getId(), AdoptionRequestStatus.PENDING)));
        return PageMapper.toResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PetResponse> getOwnerPets(Long ownerId, PetSearchCriteria criteria, Pageable pageable) {
        log.debug("Fetching pets for ownerId={}", ownerId);
        Specification<Pet> specification = PetSpecification.from(criteria).and(PetSpecification.ownedBy(ownerId));
        Page<PetResponse> page = petRepository.findAll(specification, withDefaultSort(pageable))
                .map(pet -> petMapper.toResponse(pet,
                        adoptionRequestRepository.countByPetIdAndStatus(pet.getId(), AdoptionRequestStatus.PENDING)));
        return PageMapper.toResponse(page);
    }

    @Override
    public PetResponse updatePet(Long petId, Long ownerId, PetUpdateRequest request) {
        Pet pet = getOwnedPet(petId, ownerId);
        petMapper.updateEntity(pet, request);
        log.info("Updated pet id={} by ownerId={}", petId, ownerId);
        long pending = adoptionRequestRepository.countByPetIdAndStatus(petId, AdoptionRequestStatus.PENDING);
        return petMapper.toResponse(pet, pending);
    }

    @Override
    public void deletePet(Long petId, Long ownerId) {
        Pet pet = getOwnedPet(petId, ownerId);
        adoptionRequestRepository.deleteByPetId(petId);
        petRepository.delete(pet);
        log.info("Deleted pet id={} by ownerId={}", petId, ownerId);
    }

    @Override
    @Transactional(readOnly = true)
    public OwnerDashboardResponse getOwnerDashboard(Long ownerId) {
        requireOwner(ownerId);
        Page<PetResponse> pets = petRepository.findAll(
                        PetSpecification.ownedBy(ownerId),
                        PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(pet -> petMapper.toResponse(pet,
                        adoptionRequestRepository.countByPetIdAndStatus(pet.getId(), AdoptionRequestStatus.PENDING)));
        List<AdoptionRequestResponse> requests = adoptionRequestRepository
                .findByPetOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .limit(8)
                .map(adoptionRequestMapper::toResponse)
                .toList();
        return OwnerDashboardResponse.of(
                petRepository.countByOwnerId(ownerId),
                petRepository.countByOwnerIdAndAvailability(ownerId, Availability.AVAILABLE),
                petRepository.countByOwnerIdAndAvailability(ownerId, Availability.ADOPTED),
                adoptionRequestRepository.countByPetOwnerIdAndStatus(ownerId, AdoptionRequestStatus.PENDING),
                pets,
                requests
        );
    }

    private Pet getOwnedPet(Long petId, Long ownerId) {
        Pet pet = petRepository.findWithDetailsById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));
        if (!pet.getOwner().getId().equals(ownerId)) {
            log.warn("Owner {} attempted to modify pet {} belonging to another owner", ownerId, petId);
            throw new ForbiddenException("You can only manage your own pets");
        }
        return pet;
    }

    private User requireOwner(Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        if (user.getRole() != Role.OWNER) {
            throw new ForbiddenException("Only owners can manage pet listings");
        }
        return user;
    }

    private Pageable withDefaultSort(Pageable pageable) {
        if (pageable.getSort().isSorted()) {
            return pageable;
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
