/**
 * Data Management Controller
 * 
 * REST API controller for managing data records in the credit decision system.
 * Handles CRUD operations for data management records with proper HTTP status codes.
 * 
 * Features:
 * - Full CRUD operations for data management records
 * - Proper HTTP status code handling
 * - RESTful API design patterns
 * - Integration with data management service layer
 * 
 * @author Heva Team
 * @version 1.0
 */

package com.creditdecision.creditdecisionapplication.controller;

import com.creditdecision.creditdecisionapplication.entity.DataManagementRecord;
import com.creditdecision.creditdecisionapplication.service.DataManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/data-management")
public class DataManagementController {

    @Autowired
    private DataManagementService dataManagementService;

    /**
     * Retrieve all data management records
     * @return ResponseEntity containing list of all data management records
     */
    @GetMapping
    public ResponseEntity<List<DataManagementRecord>> getAllDataManagementRecords() {
        List<DataManagementRecord> records = dataManagementService.getAllDataManagementRecords();
        return ResponseEntity.ok(records);
    }

    /**
     * Retrieve a specific data management record by ID
     * @param id The ID of the record to retrieve
     * @return ResponseEntity containing the requested data management record
     */
    @GetMapping("/{id}")
    public ResponseEntity<DataManagementRecord> getDataManagementRecordById(@PathVariable Long id) {
        DataManagementRecord record = dataManagementService.getDataManagementRecordById(id);
        return ResponseEntity.ok(record);
    }

    /**
     * Create a new data management record
     * @param record The data management record to create
     * @return ResponseEntity containing the created record with HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<DataManagementRecord> createDataManagementRecord(@RequestBody DataManagementRecord record) {
        DataManagementRecord savedRecord = dataManagementService.createDataManagementRecord(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
    }

    /**
     * Update an existing data management record
     * @param id The ID of the record to update
     * @param record The updated record data
     * @return ResponseEntity containing the updated record
     */
    @PutMapping("/{id}")
    public ResponseEntity<DataManagementRecord> updateDataManagementRecord(@PathVariable Long id, @RequestBody DataManagementRecord record) {
        DataManagementRecord updatedRecord = dataManagementService.updateDataManagementRecord(id, record);
        return ResponseEntity.ok(updatedRecord);
    }

    /**
     * Delete a data management record by ID
     * @param id The ID of the record to delete
     * @return ResponseEntity with HTTP 204 No Content status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataManagementRecord(@PathVariable Long id) {
        dataManagementService.deleteDataManagementRecord(id);
        return ResponseEntity.noContent().build();
    }
}
