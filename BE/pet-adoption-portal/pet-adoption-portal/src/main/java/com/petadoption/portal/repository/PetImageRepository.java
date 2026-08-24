package com.petadoption.portal.repository;

import com.petadoption.portal.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetImageRepository extends JpaRepository<PetImage, Long> {
}
