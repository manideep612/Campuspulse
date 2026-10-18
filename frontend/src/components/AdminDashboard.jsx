import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  RotateCw,
  Search,
  Filter,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { ComplaintCard } from './ComplaintCard';

export function AdminDashboard({ onStatusUpdate, onDelete }) {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.getStats(),
        api.getComplaints(),
      ]);
      setStats(statsData);
      setComplaints(complaintsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAdminStatusUpdate = async (id, updateData) => {
    try {
      await api.updateStatus(id, updateData);
      // Refresh data
      await loadDashboardData();
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleAdminDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Complaint #${id}?`)) {
      return;
    }
    try {
      await api.deleteComplaint(id);
      await loadDashboardData();
      if (onDelete) onDelete();
    } catch (err) {
      alert('Error deleting complaint: ' + err.message);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesSearch = searchQuery
      ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const resolutionRate = stats && stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-title">
          <div className="admin-shield-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="section-title">Campus Facilities Administration</h2>
            <p className="section-desc">
              Real-time monitoring, triage, and resolution portal for campus complaints.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadDashboardData}
          disabled={loading}
        >
          <RotateCw size={15} className={`mr-1 ${loading ? 'spin-slow' : ''}`} />
          Refresh Portal
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper total-bg">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Logged</span>
            <span className="stat-value">{stats ? stats.total : 0}</span>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper pending-bg">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Action</span>
            <span className="stat-value">{stats ? stats.pending : 0}</span>
          </div>
        </div>

        <div className="stat-card stat-in-progress">
          <div className="stat-icon-wrapper in-progress-bg">
            <RefreshCw size={24} className="spin-slow" />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats ? stats.inProgress : 0}</span>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon-wrapper resolved-bg">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Resolved</span>
            <span className="stat-value">{stats ? stats.resolved : 0}</span>
          </div>
        </div>

        <div className="stat-card stat-rate">
          <div className="stat-icon-wrapper rate-bg">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Resolution Rate</span>
            <span className="stat-value">{resolutionRate}%</span>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {stats && stats.byCategory && (
        <div className="category-stats-card">
          <h4 className="category-stats-title">Issue Breakdown by Category</h4>
          <div className="category-breakdown-grid">
            {Object.entries(stats.byCategory).map(([cat, count]) => {
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} className="category-bar-item">
                  <div className="category-bar-label">
                    <span className="cat-name">{cat}</span>
                    <span className="cat-count">{count} issues ({percentage}%)</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill progress-${cat.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Management Controls */}
      <div className="admin-manage-header">
        <h3 className="admin-manage-title">Manage Complaints ({filteredComplaints.length})</h3>
        
        <div className="admin-controls-row">
          <div className="admin-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search complaints, rooms, roll numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-filter-status">
            <Filter size={16} className="text-muted mr-1" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-select"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="IN_PROGRESS">In Progress Only</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List with Admin Controls */}
      {loading ? (
        <div className="loading-state">
          <RotateCw size={32} className="spin-slow text-primary mb-2" />
          <p>Updating Admin Data...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <ShieldCheck size={48} className="empty-icon" />
          <h3>No complaints match your filter</h3>
          <p>All complaints in this filter have been handled or none exist.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              isAdmin={true}
              onStatusUpdate={handleAdminStatusUpdate}
              onDelete={handleAdminDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
