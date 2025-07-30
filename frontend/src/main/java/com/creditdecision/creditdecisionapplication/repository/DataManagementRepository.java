package com.creditdecision.creditdecisionapplication.repository;

import com.creditdecision.creditdecisionapplication.entity.DataManagementRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataManagementRepository extends JpaRepository<DataManagementRecord, Long> {
}
