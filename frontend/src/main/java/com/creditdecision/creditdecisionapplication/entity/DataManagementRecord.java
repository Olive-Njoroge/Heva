package com.creditdecision.creditdecisionapplication.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Setter
@Getter
@Entity
public class DataManagementRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dataSource;
    private String dataType;
    private String dataFormat;
    private String dataOwner;
    private String dataDescription;
    private boolean isActive;
    private String analysis;
    private Timestamp lastUpdated;
}
