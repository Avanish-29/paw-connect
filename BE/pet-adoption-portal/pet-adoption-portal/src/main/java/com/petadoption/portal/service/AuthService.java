package com.petadoption.portal.service;

import com.petadoption.portal.dto.request.LoginRequest;
import com.petadoption.portal.dto.request.RegisterRequest;
import com.petadoption.portal.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
