package com.campuspulse.dto;

import java.util.Map;

public class DashboardStats {

    private long total;
    private long pending;
    private long inProgress;
    private long resolved;
    private Map<String, Long> byCategory;

    public DashboardStats() {
    }

    public DashboardStats(long total, long pending, long inProgress, long resolved, Map<String, Long> byCategory) {
        this.total = total;
        this.pending = pending;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.byCategory = byCategory;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }

    public Map<String, Long> getByCategory() {
        return byCategory;
    }

    public void setByCategory(Map<String, Long> byCategory) {
        this.byCategory = byCategory;
    }
}
