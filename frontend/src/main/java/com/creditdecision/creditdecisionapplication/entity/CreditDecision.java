package com.creditdecision.creditdecisionapplication.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class CreditDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double revenue;
    private String sector;
    private String behaviorData;
    private double score;
    private String tier;
    private String rationale;
    private String visuals;
}

