/**
 * Credit Decision Entity
 * 
 * JPA entity representing a credit decision record in the database.
 * Contains all necessary fields for credit assessment including financial data,
 * behavioral analysis, and decision outcomes.
 * 
 * Features:
 * - Auto-generated primary key
 * - Financial metrics (revenue, score)
 * - Industry classification (sector)
 * - Behavioral analysis data
 * - Decision outcome (tier, rationale)
 * - Visual data references
 * 
 * @author Heva Team
 * @version 1.0
 */

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
    
    /**
     * Unique identifier for the credit decision record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Annual revenue of the applicant
     */
    private double revenue;
    
    /**
     * Industry sector of the applicant (e.g., fashion, film, music)
     */
    private String sector;
    
    /**
     * Behavioral analysis data in JSON or structured format
     */
    private String behaviorData;
    
    /**
     * Calculated credit score (0-1000 scale)
     */
    private double score;
    
    /**
     * Risk tier classification (e.g., "Low", "Medium", "High")
     */
    private String tier;
    
    /**
     * AI-generated rationale for the credit decision
     */
    private String rationale;
    
    /**
     * Visual data or chart references for decision presentation
     */
    private String visuals;
}

