package com.campuspulse.controller;

import com.campuspulse.dto.ComplaintRequest;
import com.campuspulse.dto.DashboardStats;
import com.campuspulse.dto.StatusUpdateRequest;
import com.campuspulse.model.Category;
import com.campuspulse.model.Complaint;
import com.campuspulse.model.ComplaintStatus;
import com.campuspulse.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Cross-origin access for React Vite dev server
public class ComplaintController {

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    /**
     * Submit a new complaint (Student)
     */
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        Complaint created = complaintService.createComplaint(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Fetch all complaints with optional filtering by category, status, or search keyword
     */
    @GetMapping
    public ResponseEntity<List<Complaint>> getComplaints(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String search) {
        List<Complaint> complaints = complaintService.getComplaints(category, status, search);
        return ResponseEntity.ok(complaints);
    }

    /**
     * Get details of a single complaint by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    /**
     * Track complaints submitted by a specific student roll number
     */
    @GetMapping("/student/{rollNo}")
    public ResponseEntity<List<Complaint>> getComplaintsByStudent(@PathVariable String rollNo) {
        List<Complaint> complaints = complaintService.getComplaintsByRollNo(rollNo);
        return ResponseEntity.ok(complaints);
    }

    /**
     * Update the status of a complaint and add admin remarks (Admin)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        Complaint updated = complaintService.updateStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a complaint (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Fetch dashboard statistics for the admin dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        DashboardStats stats = complaintService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
