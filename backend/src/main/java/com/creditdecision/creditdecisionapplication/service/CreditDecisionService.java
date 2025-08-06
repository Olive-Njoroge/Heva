package com.creditdecision.creditdecisionapplication.service;

import com.creditdecision.creditdecisionapplication.entity.CreditDecision;
import com.creditdecision.creditdecisionapplication.exception.ResourceNotFoundException;
import com.creditdecision.creditdecisionapplication.repository.CreditDecisionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditDecisionService {
    private final CreditDecisionRepository creditDecisionRepository;

    public CreditDecisionService(CreditDecisionRepository creditDecisionRepository) {
        this.creditDecisionRepository = creditDecisionRepository;
    }

    public CreditDecision createCreditDecision(CreditDecision creditDecision) {
        double score = calculateCreditScore(creditDecision.getRevenue(), creditDecision.getSector(), creditDecision.getBehaviorData());
        String tier = determineCreditTier(score);
        String rationale = generateCreditRationale(score, creditDecision.getSector(), creditDecision.getBehaviorData());
        String visuals = generateCreditVisuals(score, creditDecision.getSector());

        creditDecision.setScore(score);
        creditDecision.setTier(tier);
        creditDecision.setRationale(rationale);
        creditDecision.setVisuals(visuals);

        return creditDecisionRepository.save(creditDecision);
    }

    public List<CreditDecision> getAllCreditDecisions() {
        return creditDecisionRepository.findAll();
    }

    public CreditDecision getCreditDecisionById(Long id) {
        return creditDecisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credit decision not found with id: " + id));
    }

    public CreditDecision updateCreditDecision(Long id, CreditDecision creditDecisionDetails) {
        CreditDecision creditDecision = getCreditDecisionById(id);
        
        creditDecision.setRevenue(creditDecisionDetails.getRevenue());
        creditDecision.setSector(creditDecisionDetails.getSector());
        creditDecision.setBehaviorData(creditDecisionDetails.getBehaviorData());
        
        // Recalculate score and related fields
        double score = calculateCreditScore(creditDecision.getRevenue(), creditDecision.getSector(), creditDecision.getBehaviorData());
        String tier = determineCreditTier(score);
        String rationale = generateCreditRationale(score, creditDecision.getSector(), creditDecision.getBehaviorData());
        String visuals = generateCreditVisuals(score, creditDecision.getSector());

        creditDecision.setScore(score);
        creditDecision.setTier(tier);
        creditDecision.setRationale(rationale);
        creditDecision.setVisuals(visuals);

        return creditDecisionRepository.save(creditDecision);
    }

    public void deleteCreditDecision(Long id) {
        CreditDecision creditDecision = getCreditDecisionById(id);
        creditDecisionRepository.delete(creditDecision);
    }

    private double calculateCreditScore(double revenue, String sector, String behaviorData) {
        double baseScore = 500;

        // Increase score based on revenue
        if (revenue > 1000000) {
            baseScore += 300;
        } else if (revenue > 500000) {
            baseScore += 200;
        } else if (revenue > 100000) {
            baseScore += 100;
        } else {
            baseScore += 50;
        }

        // Adjust score based on sector
        if (sector != null) {
            switch (sector.toLowerCase()) {
                case "technology":
                    baseScore += 100;
                    break;
                case "finance":
                    baseScore += 80;
                    break;
                case "retail":
                    baseScore += 60;
                    break;
                default:
                    baseScore += 40;
                    break;
            }
        }

        // Adjust score based on behavior data
        if (behaviorData != null && behaviorData.toLowerCase().contains("good")) {
            baseScore += 50;
        } else if (behaviorData != null && behaviorData.toLowerCase().contains("bad")) {
            baseScore -= 50;
        }

        // Ensure score is within 300-900 range
        if (baseScore < 300) baseScore = 300;
        if (baseScore > 900) baseScore = 900;

        return baseScore;
    }

    private String determineCreditTier(double score) {
        if (score >= 800) return "Platinum";
        else if (score >= 700) return "Gold";
        else if (score >= 600) return "Silver";
        else return "Bronze";
    }

    private String generateCreditRationale(double score, String sector, String behaviorData) {
        return "Rationale based on score, sector, and behavior data.";
    }

    private String generateCreditVisuals(double score, String sector) {
        return "https://example.com/credit-decision-visuals.png";
    }
}
