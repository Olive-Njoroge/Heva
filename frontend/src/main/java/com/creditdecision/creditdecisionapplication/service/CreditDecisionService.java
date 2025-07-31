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

    private double calculateCreditScore(double revenue, String sector, String behaviorData) {
        // Implement scoring logic
        return 0.0; // Placeholder
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

    public List<CreditDecision> getAllCreditDecisions() {
        return creditDecisionRepository.findAll();
    }

    public CreditDecision updateCreditDecision(Long id, CreditDecision creditDecision) {
        CreditDecision existing = creditDecisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credit decision not found with id: " + id));
        existing.setRevenue(creditDecision.getRevenue());
        existing.setSector(creditDecision.getSector());
        existing.setBehaviorData(creditDecision.getBehaviorData());
        return creditDecisionRepository.save(existing);
    }

    public void deleteCreditDecision(Long id) {
        creditDecisionRepository.deleteById(id);
    }
}
