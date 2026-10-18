package com.campuspulse.service;

import com.campuspulse.dto.ComplaintRequest;
import com.campuspulse.dto.DashboardStats;
import com.campuspulse.dto.StatusUpdateRequest;
import com.campuspulse.model.Category;
import com.campuspulse.model.Complaint;
import com.campuspulse.model.ComplaintStatus;
import com.campuspulse.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint createComplaint(ComplaintRequest request) {
        Complaint complaint = new Complaint(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory(),
                request.getLocation().trim(),
                request.getStudentName().trim(),
                request.getStudentEmail().trim().toLowerCase(),
                request.getStudentRollNo().trim().toUpperCase(),
                request.getPriority()
        );
        return complaintRepository.save(complaint);
    }

    @Transactional(readOnly = true)
    public List<Complaint> getComplaints(Category category, ComplaintStatus status, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return complaintRepository.searchComplaints(search.trim());
        }

        if (category != null && status != null) {
            return complaintRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, status);
        } else if (category != null) {
            return complaintRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else if (status != null) {
            return complaintRepository.findByStatusOrderByCreatedAtDesc(status);
        }

        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByRollNo(String rollNo) {
        return complaintRepository.findByStudentRollNoIgnoreCaseOrderByCreatedAtDesc(rollNo.trim());
    }

    @Transactional
    public Complaint updateStatus(Long id, StatusUpdateRequest request) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(request.getStatus());
        if (request.getAdminRemarks() != null) {
            complaint.setAdminRemarks(request.getAdminRemarks().trim());
        }
        return complaintRepository.save(complaint);
    }

    @Transactional
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Complaint not found with ID: " + id);
        }
        complaintRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatus(ComplaintStatus.PENDING);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);

        Map<String, Long> byCategory = new HashMap<>();
        for (Category category : Category.values()) {
            byCategory.put(category.name(), complaintRepository.countByCategory(category));
        }

        return new DashboardStats(total, pending, inProgress, resolved, byCategory);
    }
}
