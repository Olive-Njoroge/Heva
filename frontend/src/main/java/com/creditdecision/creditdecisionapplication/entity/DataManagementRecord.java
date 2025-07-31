/**
 * Data Management Record Entity
 * 
 * JPA entity representing data management records in the credit decision system.
 * Tracks data sources, types, ownership, and processing status for audit and
 * governance purposes.
 * 
 * Features:
 * - Auto-generated primary key
 * - Data source and type classification
 * - Ownership and description tracking
 * - Active status management
 * - Analysis results storage
 * - Timestamp tracking for updates
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
import java.sql.Timestamp;

@Setter
@Getter
@Entity
public class DataManagementRecord {
    
    /**
     * Unique identifier for the data management record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Source system or origin of the data
     */
    private String dataSource;
    
    /**
     * Type or category of the data (e.g., "financial", "behavioral", "external")
     */
    private String dataType;
    
    /**
     * Format of the data (e.g., "JSON", "CSV", "XML")
     */
    private String dataFormat;
    
    /**
     * Owner or responsible party for the data
     */
    private String dataOwner;
    
    /**
     * Detailed description of the data contents and purpose
     */
    private String dataDescription;
    
    /**
     * Flag indicating if the data record is currently active
     */
    private boolean isActive;
    
    /**
     * Analysis results or processing notes for the data
     */
    private String analysis;
    
    /**
     * Timestamp of the last update to this record
     */
    private Timestamp lastUpdated;
}
