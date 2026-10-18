import React, { useState } from 'react';
import { 
  MapPin, 
  User, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Zap, 
  Droplets, 
  Sparkles, 
  Armchair, 
  Wifi, 
  HelpCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';

const CATEGORY_MAP = {
  ELECTRICITY: { label: 'Electricity', icon: Zap, color: 'cat-electricity' },
  WATER: { label: 'Water', icon: Droplets, color: 'cat-water' },
  CLEANLINESS: { label: 'Cleanliness', icon: Sparkles, color: 'cat-cleanliness' },
  FURNITURE: { label: 'Furniture', icon: Armchair, color: 'cat-furniture' },
  INTERNET: { label: 'Internet', icon: Wifi, color: 'cat-internet' },
  OTHER: { label: 'Other', icon: HelpCircle, color: 'cat-other' },
};

export function ComplaintCard({ complaint, isAdmin, onStatusUpdate, onDelete }) {
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [remarks, setRemarks] = useState(complaint.adminRemarks || '');
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const catMeta = CATEGORY_MAP[complaint.category] || CATEGORY_MAP.OTHER;
  const CategoryIcon = catMeta.icon;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    if (onStatusUpdate) {
      setIsUpdating(true);
      try {
        await onStatusUpdate(complaint.id, {
          status: newStatus,
          adminRemarks: complaint.adminRemarks
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSaveRemarks = async () => {
    if (onStatusUpdate) {
      setIsUpdating(true);
      try {
        await onStatusUpdate(complaint.id, {
          status: complaint.status,
          adminRemarks: remarks
        });
        setIsEditingRemarks(false);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={`complaint-card card-status-${complaint.status.toLowerCase()}`}>
      <div className="card-top">
        <div className="card-meta">
          <span className="complaint-id">#{complaint.id}</span>
          <span className={`category-tag ${catMeta.color}`}>
            <CategoryIcon size={14} className="mr-1" />
            {catMeta.label}
          </span>
          <PriorityBadge priority={complaint.priority} />
        </div>
        <div className="card-status-wrapper">
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      <h3 className="card-title">{complaint.title}</h3>
      <p className="card-description">{complaint.description}</p>

      <div className="card-details-grid">
        <div className="detail-item">
          <MapPin size={15} className="detail-icon text-muted" />
          <span className="detail-text">{complaint.location}</span>
        </div>
        <div className="detail-item">
          <User size={15} className="detail-icon text-muted" />
          <span className="detail-text">
            {complaint.studentName} ({complaint.studentRollNo})
          </span>
        </div>
        <div className="detail-item">
          <Calendar size={15} className="detail-icon text-muted" />
          <span className="detail-text">Logged: {formatDate(complaint.createdAt)}</span>
        </div>
      </div>

      {/* Admin Remarks Section */}
      {complaint.adminRemarks && !isEditingRemarks && (
        <div className="admin-remarks-box">
          <div className="remarks-header">
            <ShieldAlert size={14} className="mr-1 text-primary" />
            <strong>Admin Update:</strong>
          </div>
          <p className="remarks-body">{complaint.adminRemarks}</p>
        </div>
      )}

      {/* Admin Action Controls */}
      {isAdmin && (
        <div className="admin-actions-bar">
          <div className="admin-action-group">
            <label className="admin-action-label">Change Status:</label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="admin-select"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="admin-action-buttons">
            <button
              type="button"
              className="btn btn-outline-sm"
              onClick={() => setIsEditingRemarks(!isEditingRemarks)}
            >
              <MessageSquare size={14} className="mr-1" />
              {complaint.adminRemarks ? 'Edit Remarks' : 'Add Remarks'}
            </button>

            <button
              type="button"
              className="btn btn-danger-sm"
              onClick={() => onDelete && onDelete(complaint.id)}
              title="Delete complaint"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Inline Remarks Editor for Admin */}
      {isAdmin && isEditingRemarks && (
        <div className="remarks-editor">
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add update for the student (e.g. Technician dispatched, parts ordered)..."
            className="form-textarea form-textarea-sm"
          />
          <div className="remarks-editor-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditingRemarks(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={isUpdating}
              onClick={handleSaveRemarks}
            >
              Save Remark
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
