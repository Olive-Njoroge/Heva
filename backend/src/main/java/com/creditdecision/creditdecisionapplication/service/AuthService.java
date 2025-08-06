package com.creditdecision.creditdecisionapplication.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.creditdecision.creditdecisionapplication.entity.User;
import com.creditdecision.creditdecisionapplication.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailValidationService emailValidationService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public boolean registerUser(User user) {
        String originalEmail = user.getEmail();
        String normalizedEmail = emailValidationService.normalizeEmail(originalEmail);
        
        logger.info("Attempting to register user with email: {}", normalizedEmail);
        
        if (!emailValidationService.isEmailAvailable(originalEmail)) {
            logger.warn("Registration failed - email already exists: {}", normalizedEmail);
            return false;
        }
        
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        try {
            userRepository.save(user);
            logger.info("Successfully registered user with email: {}", normalizedEmail);
            return true;
        } catch (Exception e) {
            logger.error("Error registering user with email: {}", normalizedEmail, e);
            return false;
        }
    }

    public String loginUser(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            if (authentication.isAuthenticated()) {
                // Restrict admin login to only admin@gmail.com
                User user = userRepository.findByEmail(email);
                if ("admin".equals(user.getRole()) && !"admin@gmail.com".equalsIgnoreCase(email)) {
                    return null; // Reject login for any admin other than admin@gmail.com
                }
                return jwtUtil.generateToken(email);
            }
        } catch (AuthenticationException e) {
            return null;
        }
        return null;
    }
}
