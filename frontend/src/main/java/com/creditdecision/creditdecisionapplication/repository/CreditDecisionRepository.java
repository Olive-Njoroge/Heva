package com.creditdecision.creditdecisionapplication.repository;

import com.creditdecision.creditdecisionapplication.entity.CreditDecision;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditDecisionRepository extends JpaRepository<CreditDecision, Long> {
}
