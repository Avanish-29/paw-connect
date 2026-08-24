package com.petadoption.portal.dto.response;

import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Species;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PetSummaryResponse {

    private Long id;
    private String name;
    private Species species;
    private String breed;
    private Integer age;
    private Gender gender;
    private HealthStatus healthStatus;
    private String location;
    private Availability availability;
    private String primaryImageUrl;
}
