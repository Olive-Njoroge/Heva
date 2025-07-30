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

    public CreditDecisionController(CreditDecisionService creditDecisionService) {
        this.creditDecisionService = creditDecisionService;
    }

    @PostMapping
    public CreditDecision createCreditDecision(@RequestBody CreditDecision creditDecision) {
        return creditDecisionService.createCreditDecision(creditDecision);
    }

    @GetMapping
    public List<CreditDecision> getAllCreditDecisions() {
        return creditDecisionService.getAllCreditDecisions();
    }

    @PutMapping("/{id}")
    public CreditDecision updateCreditDecision(@PathVariable Long id, @RequestBody CreditDecision creditDecision) {
        return creditDecisionService.updateCreditDecision(id, creditDecision);
    }

    @DeleteMapping("/{id}")
    public void deleteCreditDecision(@PathVariable Long id) {
        creditDecisionService.deleteCreditDecision(id);
    }
}
