package com.creditdecision.creditdecisionapplication.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "admin" or "user"

    @Column(nullable = false)
    private String name;

    // New fields added for profile
    private String businessName;
    private String industry;
    private String location;
    private Integer yearsInBusiness;
    private String phone;
    private String website;
    private String instagram;
    private String linkedin;
    private String bio;
    private String specialties;
    private String revenueModel;
    private String lastActivity;

    // Getters and setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    
    public void setEmail(String email) {
        this.email = email;

    }

    public String getPassword() {

        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    
    public String getRole() {
        return role;

    }

    public void setRole(String role) {

        this.role = role;
    }


    public String getName() {
        return name;
    }

    
    public void setName(String name) {
        this.name = name;

    }

    public String getBusinessName() {

        return businessName;
    }


    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    
    public String getIndustry() {
        return industry;

    }

    public void setIndustry(String industry) {

        this.industry = industry;
    }


    public String getLocation() {
        return location;
    }

    
    public void setLocation(String location) {
        this.location = location;

    }

    public Integer getYearsInBusiness() {

        return yearsInBusiness;
    }


    public void setYearsInBusiness(Integer yearsInBusiness) {
        this.yearsInBusiness = yearsInBusiness;
    }

    
    public String getPhone() {
        return phone;

    }

    public void setPhone(String phone) {

        this.phone = phone;
    }


    public String getWebsite() {
        return website;
    }

    
    public void setWebsite(String website) {
        this.website = website;

    }

    public String getInstagram() {

        return instagram;
    }


    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    
    public String getLinkedin() {
        return linkedin;

    }

    public void setLinkedin(String linkedin) {

        this.linkedin = linkedin;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSpecialties() {
        return specialties;
    }

    public void setSpecialties(String specialties) {
        this.specialties = specialties;
    }

    public String getRevenueModel() {
        return revenueModel;
    }

    public void setRevenueModel(String revenueModel) {
        this.revenueModel = revenueModel;
    }

    public String getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(String lastActivity) {
        this.lastActivity = lastActivity;
    }
}
