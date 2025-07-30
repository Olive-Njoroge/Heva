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

    @GetMapping
    public ResponseEntity<List<DataManagementRecord>> getAllDataManagementRecords() {
        List<DataManagementRecord> records = dataManagementService.getAllDataManagementRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataManagementRecord> getDataManagementRecordById(@PathVariable Long id) {
        DataManagementRecord record = dataManagementService.getDataManagementRecordById(id);
        return ResponseEntity.ok(record);
    }

    @PostMapping
    public ResponseEntity<DataManagementRecord> createDataManagementRecord(@RequestBody DataManagementRecord record) {
        DataManagementRecord savedRecord = dataManagementService.createDataManagementRecord(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DataManagementRecord> updateDataManagementRecord(@PathVariable Long id, @RequestBody DataManagementRecord record) {
        DataManagementRecord updatedRecord = dataManagementService.updateDataManagementRecord(id, record);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataManagementRecord(@PathVariable Long id) {
        dataManagementService.deleteDataManagementRecord(id);
        return ResponseEntity.noContent().build();
    }
}
