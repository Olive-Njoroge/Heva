/**
 * Credit Decision Controller
 * 
 * REST API controller for managing credit decision operations.
 * Provides endpoints for creating, retrieving, updating, and deleting credit decisions.
 * 
 * Features:
 * - CRUD operations for credit decisions
 * - Cross-origin support for frontend integration
 * - RESTful API design
 * - Integration with credit decision service layer
 * 
 * @author Heva Team
 * @version 1.0
 */

package com.creditdecision.creditdecisionapplication.controller;

import com.creditdecision.creditdecisionapplication.entity.CreditDecision;
import org.springframework.beans.factory.annotation.Autowired;
import com.creditdecision.creditdecisionapplication.service.CreditDecisionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin( origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/credit-decisions")
public class CreditDecisionController {
    @Autowired
    private final CreditDecisionService creditDecisionService;

    /**
     * Constructor injection for credit decision service
     * @param creditDecisionService Service for handling credit decision business logic
     */
    public CreditDecisionController(CreditDecisionService creditDecisionService) {
        this.creditDecisionService = creditDecisionService;
    }

    /**
     * Create a new credit decision
     * @param creditDecision The credit decision data to create
     * @return The created credit decision with generated ID
     */
    @PostMapping
    public CreditDecision createCreditDecision(@RequestBody CreditDecision creditDecision) {
        return creditDecisionService.createCreditDecision(creditDecision);
    }

    /**
     * Retrieve all credit decisions
     * @return List of all credit decisions in the system
     */
    @GetMapping
    public List<CreditDecision> getAllCreditDecisions() {
        return creditDecisionService.getAllCreditDecisions();
    }

    /**
     * Update an existing credit decision
     * @param id The ID of the credit decision to update
     * @param creditDecision The updated credit decision data
     * @return The updated credit decision
     */
    @PutMapping("/{id}")
    public CreditDecision updateCreditDecision(@PathVariable Long id, @RequestBody CreditDecision creditDecision) {
        return creditDecisionService.updateCreditDecision(id, creditDecision);
    }

    /**
     * Delete a credit decision by ID
     * @param id The ID of the credit decision to delete
     */
    @DeleteMapping("/{id}")
    public void deleteCreditDecision(@PathVariable Long id) {
        creditDecisionService.deleteCreditDecision(id);
    }
}
