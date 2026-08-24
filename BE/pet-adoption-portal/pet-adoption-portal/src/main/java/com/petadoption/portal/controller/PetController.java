package com.petadoption.portal.controller;

import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.dto.response.PageResponse;
import com.petadoption.portal.dto.response.PetResponse;
import com.petadoption.portal.enums.Availability;
import com.petadoption.portal.enums.Gender;
import com.petadoption.portal.enums.HealthStatus;
import com.petadoption.portal.enums.Species;
import com.petadoption.portal.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<PageResponse<PetResponse>> getPets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Species species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) HealthStatus healthStatus,
            @RequestParam(required = false) Availability availability,
            @PageableDefault(size = 9) Pageable pageable) {
        PetSearchCriteria criteria = new PetSearchCriteria();
        criteria.setSearch(search);
        criteria.setSpecies(species);
        criteria.setBreed(breed);
        criteria.setGender(gender);
        criteria.setLocation(location);
        criteria.setHealthStatus(healthStatus);
        criteria.setAvailability(availability);
        return ResponseEntity.ok(petService.getPets(criteria, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }
}
