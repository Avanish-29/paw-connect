package com.petadoption.portal.mapper;

import com.petadoption.portal.dto.request.PetCreateRequest;
import com.petadoption.portal.dto.request.PetUpdateRequest;
import com.petadoption.portal.dto.response.PetImageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.dto.response.PetSummaryResponse;
import com.petadoption.portal.entity.Pet;
import com.petadoption.portal.entity.PetImage;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.Availability;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class PetMapper {

    private final UserMapper userMapper;

    public Pet toEntity(PetCreateRequest request, User owner) {
        Pet pet = Pet.builder()
                .owner(owner)
                .name(request.getName().trim())
                .species(request.getSpecies())
                .breed(blankToNull(request.getBreed()))
                .age(request.getAge())
                .gender(request.getGender())
                .healthStatus(request.getHealthStatus())
                .location(request.getLocation().trim())
                .description(request.getDescription().trim())
                .availability(request.getAvailability() != null
                        ? request.getAvailability()
                        : Availability.AVAILABLE)
                .build();
        applyImage(pet, request.getImageUrl());
        return pet;
    }

    public void updateEntity(Pet pet, PetUpdateRequest request) {
        if (StringUtils.hasText(request.getName())) {
            pet.setName(request.getName().trim());
        }
        if (request.getSpecies() != null) {
            pet.setSpecies(request.getSpecies());
        }
        if (request.getBreed() != null) {
            pet.setBreed(blankToNull(request.getBreed()));
        }
        if (request.getAge() != null) {
            pet.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            pet.setGender(request.getGender());
        }
        if (request.getHealthStatus() != null) {
            pet.setHealthStatus(request.getHealthStatus());
        }
        if (StringUtils.hasText(request.getLocation())) {
            pet.setLocation(request.getLocation().trim());
        }
        if (StringUtils.hasText(request.getDescription())) {
            pet.setDescription(request.getDescription().trim());
        }
        if (request.getAvailability() != null) {
            pet.setAvailability(request.getAvailability());
        }
        if (request.getImageUrl() != null) {
            pet.clearImages();
            applyImage(pet, request.getImageUrl());
        }
    }

    public PetResponse toResponse(Pet pet) {
        return toResponse(pet, 0);
    }

    public PetResponse toResponse(Pet pet, long pendingRequestCount) {
        List<PetImageResponse> images = pet.getImages() == null
                ? List.of()
                : pet.getImages().stream().map(this::toImageResponse).toList();
        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .gender(pet.getGender())
                .healthStatus(pet.getHealthStatus())
                .location(pet.getLocation())
                .description(pet.getDescription())
                .availability(pet.getAvailability())
                .primaryImageUrl(resolvePrimaryUrl(pet))
                .images(images)
                .owner(userMapper.toResponse(pet.getOwner()))
                .pendingRequestCount(pendingRequestCount)
                .createdAt(pet.getCreatedAt())
                .updatedAt(pet.getUpdatedAt())
                .build();
    }

    public PetSummaryResponse toSummary(Pet pet) {
        return PetSummaryResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .gender(pet.getGender())
                .healthStatus(pet.getHealthStatus())
                .location(pet.getLocation())
                .availability(pet.getAvailability())
                .primaryImageUrl(resolvePrimaryUrl(pet))
                .build();
    }

    private PetImageResponse toImageResponse(PetImage image) {
        return PetImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .primary(image.isPrimaryImage())
                .build();
    }

    private void applyImage(Pet pet, String imageUrl) {
        if (!StringUtils.hasText(imageUrl)) {
            return;
        }
        PetImage image = PetImage.builder()
                .imageUrl(imageUrl.trim())
                .primaryImage(true)
                .build();
        pet.addImage(image);
    }

    private String resolvePrimaryUrl(Pet pet) {
        if (pet.getImages() == null || pet.getImages().isEmpty()) {
            return null;
        }
        return pet.getImages().stream()
                .filter(PetImage::isPrimaryImage)
                .map(PetImage::getImageUrl)
                .findFirst()
                .orElse(pet.getImages().getFirst().getImageUrl());
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
