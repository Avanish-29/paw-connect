package com.petadoption.portal.mapper;

import com.petadoption.portal.dto.response.AdoptionRequestResponse;
import com.petadoption.portal.entity.AdoptionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdoptionRequestMapper {

    private final PetMapper petMapper;
    private final UserMapper userMapper;

    public AdoptionRequestResponse toResponse(AdoptionRequest request) {
        return AdoptionRequestResponse.builder()
                .id(request.getId())
                .pet(petMapper.toSummary(request.getPet()))
                .adopter(userMapper.toResponse(request.getAdopter()))
                .message(request.getMessage())
                .status(request.getStatus())
                .ownerNote(request.getOwnerNote())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
