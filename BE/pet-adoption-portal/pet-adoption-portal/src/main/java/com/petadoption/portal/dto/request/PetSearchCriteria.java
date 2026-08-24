package com.petadoption.portal.dto.request;

import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Species;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetSearchCriteria {

    private String search;
    private Species species;
    private String breed;
    private Gender gender;
    private String location;
    private HealthStatus healthStatus;
    private Availability availability;
}
