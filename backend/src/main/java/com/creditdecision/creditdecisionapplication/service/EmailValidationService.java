package com.creditdecision.creditdecisionapplication.service;

import com.creditdecision.creditdecisionapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailValidationService {

    @Autowired
    private UserRepository userRepository;

    public boolean isEmailAvailable(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        String normalizedEmail = email.trim().toLowerCase();
        return userRepository.findByEmailIgnoreCaseAndTrim(normalizedEmail) == null;
    }

    public String normalizeEmail(String email) {
        if (email == null) return "";
        return email.trim().toLowerCase();
    }
}
