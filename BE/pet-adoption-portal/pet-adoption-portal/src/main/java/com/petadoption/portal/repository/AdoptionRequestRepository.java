package com.petadoption.portal.repository;

import com.petadoption.portal.entity.AdoptionRequest;
import com.petadoption.portal.enums.AdoptionRequestStatus;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

    boolean existsByPetIdAndAdopterIdAndStatus(Long petId, Long adopterId, AdoptionRequestStatus status);

    @EntityGraph(attributePaths = {"pet", "pet.images", "adopter", "pet.owner"})
    List<AdoptionRequest> findByAdopterIdOrderByCreatedAtDesc(Long adopterId);

    @EntityGraph(attributePaths = {"pet", "pet.images", "adopter", "pet.owner"})
    List<AdoptionRequest> findByPetOwnerIdOrderByCreatedAtDesc(Long ownerId);

    @EntityGraph(attributePaths = {"pet", "pet.images", "adopter", "pet.owner"})
    List<AdoptionRequest> findAllByOrderByCreatedAtDesc();

    List<AdoptionRequest> findByPetIdAndStatus(Long petId, AdoptionRequestStatus status);

    long countByStatus(AdoptionRequestStatus status);

    long countByAdopterId(Long adopterId);

    long countByAdopterIdAndStatus(Long adopterId, AdoptionRequestStatus status);

    long countByPetOwnerIdAndStatus(Long ownerId, AdoptionRequestStatus status);

    long countByPetIdAndStatus(Long petId, AdoptionRequestStatus status);

    void deleteByPetId(Long petId);
}
