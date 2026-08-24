package com.petadoption.portal.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetImageResponse {

    private Long id;
    private String imageUrl;
    private boolean primary;
}
