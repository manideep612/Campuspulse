import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Sparkles, 
  Armchair, 
  Wifi, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  User,
  Mail,
  Hash,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  { id: 'ELECTRICITY', label: 'Electricity', icon: Zap, desc: 'Fans, lights, AC, power plugs' },
  { id: 'WATER', label: 'Water', icon: Droplets, desc: 'Coolers, taps, washrooms, leaks' },
  { id: 'CLEANLINESS', label: 'Cleanliness', icon: Sparkles, desc: 'Dustbins, corridors, classrooms' },
  { id: 'FURNITURE', label: 'Furniture', icon: Armchair, desc: 'Benches, chairs, podiums, boards' },
  { id: 'INTERNET', label: 'Internet', icon: Wifi, desc: 'Campus Wi-Fi, LAN ports, router issues' },
  { id: 'OTHER', label: 'Other', icon: HelpCircle, desc: 'General campus maintenance' },
];

export function ComplaintForm({ onComplaintSubmitted, onViewComplaints }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'ELECTRICITY',
    location: '',
    description: '',
    studentName: '',
    studentRollNo: '',
    studentEmail: '',
    priority: 'MEDIUM',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successComplaint, setSuccessComplaint] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.createComplaint(formData);
      setSuccessComplaint(response);
      if (onComplaintSubmitted) onComplaintSubmitted(response);
      // Reset form
      setFormData({
        title: '',
        category: 'ELECTRICITY',
        location: '',
        description: '',
        studentName: '',
        studentRollNo: '',
        studentEmail: '',
        priority: 'MEDIUM',
      });
    } catch (err) {
      setError(err.message || 'Could not submit complaint. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="section-title">Lodge a Campus Complaint</h2>
        <p className="section-desc">
          Report maintenance or infrastructure issues directly to the campus administration for rapid resolution.
        </p>
      </div>

      {successComplaint && (
        <div className="alert alert-success">
          <div className="alert-icon">
            <CheckCircle size={24} />
          </div>
          <div className="alert-content">
            <h4>Complaint Registered Successfully!</h4>
            <p>
              Your complaint ID is <strong>#{successComplaint.id}</strong>. Our campus maintenance department has been notified.
            </p>
            <div className="alert-actions">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setSuccessComplaint(null)}
              >
                Submit Another Complaint
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={onViewComplaints}
              >
                Track in Complaints Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        {/* Category Selection */}
        <div className="form-group">
          <label className="form-label">Select Issue Category *</label>
          <div className="category-grid">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <div className="category-icon">
                    <Icon size={22} />
                  </div>
                  <div className="category-text">
                    <span className="category-name">{cat.label}</span>
                    <span className="category-hint">{cat.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complaint Title & Priority */}
        <div className="form-row">
          <div className="form-group flex-2">
            <label className="form-label">
              <FileText size={16} /> Brief Issue Title *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={150}
              placeholder="e.g., Water leakage in Boys Hostel 2nd floor washroom"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Urgency Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-input"
            >
              <option value="LOW">Low (Can wait a few days)</option>
              <option value="MEDIUM">Medium (Normal priority)</option>
              <option value="HIGH">High (Affects ongoing classes)</option>
              <option value="URGENT">Urgent (Safety or critical outage)</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={16} /> Campus Location / Room *
          </label>
          <input
            type="text"
            name="location"
            required
            maxLength={120}
            placeholder="e.g., Academic Block A, Room 304 OR Boys Hostel B Room 212"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Detailed Description *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            maxLength={2000}
            placeholder="Provide specific details about what is broken, how long the issue has persisted, or any safety precautions needed..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        {/* Student Details */}
        <div className="student-details-card">
          <h4 className="student-details-title">Student Information</h4>
          <p className="student-details-desc">Your contact details are required so the facility team can reach you if needed.</p>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">
                <User size={15} /> Your Full Name *
              </label>
              <input
                type="text"
                name="studentName"
                required
                maxLength={100}
                placeholder="e.g., Rahul Sharma"
                value={formData.studentName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">
                <Hash size={15} /> Roll Number / Student ID *
              </label>
              <input
                type="text"
                name="studentRollNo"
                required
                maxLength={50}
                placeholder="e.g., 22BCSE104"
                value={formData.studentRollNo}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">
                <Mail size={15} /> College Email Address *
              </label>
              <input
                type="email"
                name="studentEmail"
                required
                maxLength={120}
                placeholder="e.g., rahul.s@college.edu"
                value={formData.studentEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? (
              <span>Submitting Complaint...</span>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Submit Campus Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
