package com.petadoption.portal.specification;

import com.petadoption.portal.dto.request.PetSearchCriteria;
import com.petadoption.portal.entity.Pet;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class PetSpecification {

    private PetSpecification() {
    }

    public static Specification<Pet> from(PetSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (criteria == null) {
                return cb.conjunction();
            }

            if (StringUtils.hasText(criteria.getSearch())) {
                String like = "%" + criteria.getSearch().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("breed")), like),
                        cb.like(cb.lower(root.get("location")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (criteria.getSpecies() != null) {
                predicates.add(cb.equal(root.get("species"), criteria.getSpecies()));
            }
            if (StringUtils.hasText(criteria.getBreed())) {
                predicates.add(cb.like(
                        cb.lower(root.get("breed")),
                        "%" + criteria.getBreed().trim().toLowerCase() + "%"));
            }
            if (criteria.getGender() != null) {
                predicates.add(cb.equal(root.get("gender"), criteria.getGender()));
            }
            if (StringUtils.hasText(criteria.getLocation())) {
                predicates.add(cb.like(
                        cb.lower(root.get("location")),
                        "%" + criteria.getLocation().trim().toLowerCase() + "%"));
            }
            if (criteria.getHealthStatus() != null) {
                predicates.add(cb.equal(root.get("healthStatus"), criteria.getHealthStatus()));
            }
            if (criteria.getAvailability() != null) {
                predicates.add(cb.equal(root.get("availability"), criteria.getAvailability()));
            }
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("owner", JoinType.LEFT);
                root.fetch("images", JoinType.LEFT);
                query.distinct(true);
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    public static Specification<Pet> ownedBy(Long ownerId) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("owner", JoinType.LEFT);
                root.fetch("images", JoinType.LEFT);
                query.distinct(true);
            }
            return cb.equal(root.get("owner").get("id"), ownerId);
        };
    }
}
