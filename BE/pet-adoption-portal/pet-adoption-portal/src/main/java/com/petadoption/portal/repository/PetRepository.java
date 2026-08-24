package com.petadoption.portal.repository;

import com.petadoption.portal.entity.Pet;
import com.petadoption.portal.enums.Availability;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long>, JpaSpecificationExecutor<Pet> {

    @EntityGraph(attributePaths = {"owner", "images"})
    Optional<Pet> findWithDetailsById(Long id);

    List<Pet> findByOwnerId(Long ownerId);

    long countByOwnerId(Long ownerId);

    long countByOwnerIdAndAvailability(Long ownerId, Availability availability);

    long countByAvailability(Availability availability);

    @EntityGraph(attributePaths = {"owner", "images"})
    List<Pet> findTop8ByAvailabilityOrderByCreatedAtDesc(Availability availability);
}
