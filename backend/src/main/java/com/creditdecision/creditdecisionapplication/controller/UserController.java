package com.creditdecision.creditdecisionapplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creditdecision.creditdecisionapplication.entity.User;
import com.creditdecision.creditdecisionapplication.repository.UserRepository;
import com.creditdecision.creditdecisionapplication.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updatedUserMap, Authentication authentication) {
        String currentUserEmail = authentication.getName();
        User user = userRepository.findByEmail(currentUserEmail);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Update user fields manually from map
        if (updatedUserMap.containsKey("name")) {
            user.setName((String) updatedUserMap.get("name"));
        }
        if (updatedUserMap.containsKey("businessName")) {
            user.setBusinessName((String) updatedUserMap.get("businessName"));
        }
        if (updatedUserMap.containsKey("industry")) {
            user.setIndustry((String) updatedUserMap.get("industry"));
        }
        if (updatedUserMap.containsKey("location")) {
            user.setLocation((String) updatedUserMap.get("location"));
        }
        if (updatedUserMap.containsKey("yearsInBusiness")) {
            user.setYearsInBusiness((Integer) updatedUserMap.get("yearsInBusiness"));
        }
        if (updatedUserMap.containsKey("phone")) {
            user.setPhone((String) updatedUserMap.get("phone"));
        }
        if (updatedUserMap.containsKey("website")) {
            user.setWebsite((String) updatedUserMap.get("website"));
        }
        if (updatedUserMap.containsKey("instagram")) {
            user.setInstagram((String) updatedUserMap.get("instagram"));
        }
        if (updatedUserMap.containsKey("linkedin")) {
            user.setLinkedin((String) updatedUserMap.get("linkedin"));
        }
        if (updatedUserMap.containsKey("bio")) {
            user.setBio((String) updatedUserMap.get("bio"));
        }
        if (updatedUserMap.containsKey("specialties")) {
            user.setSpecialties((String) updatedUserMap.get("specialties"));
        }
        if (updatedUserMap.containsKey("revenueModel")) {
            user.setRevenueModel((String) updatedUserMap.get("revenueModel"));
        }
        if (updatedUserMap.containsKey("lastActivity")) {
            user.setLastActivity((String) updatedUserMap.get("lastActivity"));
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
