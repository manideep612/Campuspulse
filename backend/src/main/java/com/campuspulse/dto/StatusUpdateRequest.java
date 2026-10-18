package com.campuspulse.dto;

import com.campuspulse.model.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    @Size(max = 1000, message = "Remarks cannot exceed 1000 characters")
    private String adminRemarks;

    public StatusUpdateRequest() {
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}
