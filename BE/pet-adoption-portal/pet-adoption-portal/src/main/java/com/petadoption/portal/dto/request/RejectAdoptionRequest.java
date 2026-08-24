package com.petadoption.portal.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectAdoptionRequest {

    @Size(max = 1000, message = "Owner note must be at most 1000 characters")
    private String ownerNote;
}
