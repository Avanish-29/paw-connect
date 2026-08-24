package com.petadoption.portal.service;

import com.petadoption.portal.dto.request.UpdateProfileRequest;
import com.petadoption.portal.dto.response.UserResponse;

public interface UserService {

    UserResponse getCurrentUser(Long userId);

    UserResponse updateCurrentUser(Long userId, UpdateProfileRequest request);
}
