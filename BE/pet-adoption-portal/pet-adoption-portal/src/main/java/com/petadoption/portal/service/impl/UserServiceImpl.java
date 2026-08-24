package com.petadoption.portal.service.impl;

import com.petadoption.portal.dto.request.UpdateProfileRequest;
import com.petadoption.portal.dto.response.UserResponse;
import com.petadoption.portal.entity.User;
import com.petadoption.portal.exception.ResourceNotFoundException;
import com.petadoption.portal.mapper.UserMapper;
import com.petadoption.portal.repository.UserRepository;
import com.petadoption.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        log.debug("Fetching current user id={}", userId);
        return userMapper.toResponse(findUser(userId));
    }

    @Override
    public UserResponse updateCurrentUser(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);
        userMapper.updateEntity(user, request);
        log.info("Updated profile for userId={}", userId);
        return userMapper.toResponse(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
