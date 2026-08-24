package com.petadoption.portal.repository;

import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.Role;
import com.petadoption.portal.enums.UserStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(Role role);

    long countByStatus(UserStatus status);
}
