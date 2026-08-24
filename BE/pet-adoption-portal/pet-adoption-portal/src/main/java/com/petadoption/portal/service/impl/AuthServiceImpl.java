package com.petadoption.portal.service.impl;

import com.petadoption.portal.dto.request.LoginRequest;
import com.petadoption.portal.dto.request.RegisterRequest;
import com.petadoption.portal.dto.response.LoginResponse;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.enums.Role;
import com.petadoption.portal.enums.UserStatus;
import com.petadoption.portal.exception.BadRequestException;
import com.petadoption.portal.exception.DuplicateResourceException;
import com.petadoption.portal.exception.UnauthorizedException;
import com.petadoption.portal.mapper.UserMapper;
import com.petadoption.portal.repository.UserRepository;
import com.petadoption.portal.security.CustomUserDetails;
import com.petadoption.portal.security.JwtService;
import com.petadoption.portal.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Override
    public LoginResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            log.warn("Attempt to self-register as ADMIN blocked");
            throw new BadRequestException("Admin accounts cannot be created through registration");
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            log.warn("Registration failed because email already exists");
            throw new DuplicateResourceException("An account with this email already exists");
        }
        User user = userMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(user);
        log.info("Registered user id={} role={}", saved.getId(), saved.getRole());
        return toLoginResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            log.warn("Inactive user attempted login userId={}", user.getId());
            throw new UnauthorizedException("This account is inactive");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for userId={}", user.getId());
            throw new UnauthorizedException("Invalid credentials");
        }
        log.info("Successful login userId={} role={}", user.getId(), user.getRole());
        return toLoginResponse(user);
    }

    private LoginResponse toLoginResponse(User user) {
        String token = jwtService.generateToken(new CustomUserDetails(user));
        return LoginResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }
}
