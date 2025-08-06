package com.creditdecision.creditdecisionapplication.service;

import com.creditdecision.creditdecisionapplication.entity.DataManagementRecord;
import com.creditdecision.creditdecisionapplication.exception.ResourceNotFoundException;
import com.creditdecision.creditdecisionapplication.repository.DataManagementRepository;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.List;

@Service
public class DataManagementService {
    private final DataManagementRepository dataManagementRepository;

    public DataManagementService(DataManagementRepository dataManagementRepository) {
        this.dataManagementRepository = dataManagementRepository;
    }

    public DataManagementRecord createDataManagementRecord(DataManagementRecord record) {
        record.setLastUpdated(new Timestamp(System.currentTimeMillis()));
        String analysis = analyzeData(record.getDataSource());
        record.setAnalysis(analysis);
        return dataManagementRepository.save(record);
    }

    private String analyzeData(String dataSource) {
        if (dataSource.equals("API")) return "The data from the API is valid and up-to-date.";
        else if (dataSource.equals("Database")) return "The data from the database needs to be cleaned and normalized.";
        else return "Unable to analyze the data source.";
    }

    public List<DataManagementRecord> getAllDataManagementRecords() {
        return dataManagementRepository.findAll();
    }

    public DataManagementRecord getDataManagementRecordById(Long id) {
        return dataManagementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data management record not found with id: " + id));
    }

    public DataManagementRecord updateDataManagementRecord(Long id, DataManagementRecord record) {
        DataManagementRecord existing = dataManagementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Data management record not found with id: " + id));
        existing.setDataSource(record.getDataSource());
        existing.setDataType(record.getDataType());
        existing.setDataFormat(record.getDataFormat());
        existing.setDataOwner(record.getDataOwner());
        existing.setDataDescription(record.getDataDescription());
        existing.setIsActive(record.getIsActive());
        return dataManagementRepository.save(existing);
    }

    public void deleteDataManagementRecord(Long id) {
        dataManagementRepository.deleteById(id);
    }
}
