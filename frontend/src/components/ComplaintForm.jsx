import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  Sparkle,
  Cpu,
  Check,
  RotateCw,
  Info
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

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);
  const debounceTimerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAppliedSuggestion(false);
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setAppliedSuggestion(false);
  };

  // Trigger AI prediction function
  const triggerAiPrediction = async (titleText, descText) => {
    const combined = `${titleText || ''} ${descText || ''}`.trim();
    if (combined.length < 8) {
      setAiPrediction(null);
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const result = await api.predictAi({
        title: titleText,
        description: descText,
      });
      setAiPrediction(result);
    } catch (err) {
      console.warn('AI Suggestion unavailable:', err.message);
      setAiError('AI assistant is offline. You can still select categories manually.');
    } finally {
      setAiLoading(false);
    }
  };

  // Debounced auto-prediction when title or description changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const combinedLength = (formData.title + ' ' + formData.description).trim().length;
    if (combinedLength >= 10) {
      debounceTimerRef.current = setTimeout(() => {
        triggerAiPrediction(formData.title, formData.description);
      }, 700);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.title, formData.description]);

  // Apply suggestion action (Never silently overrides)
  const handleApplySuggestion = () => {
    if (!aiPrediction) return;

    setFormData((prev) => ({
      ...prev,
      category: aiPrediction.predictedCategory || prev.category,
      priority: aiPrediction.predictedPriority || prev.priority,
    }));
    setAppliedSuggestion(true);
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
      setAiPrediction(null);
      setAppliedSuggestion(false);
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
          Describe the problem below. Our local Naive Bayes AI model will automatically analyze your issue and recommend the category and urgency.
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
        {/* Complaint Title */}
        <div className="form-group">
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

        {/* Detailed Description */}
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">
              Detailed Description *
            </label>
            <button
              type="button"
              className="ai-analyze-btn"
              onClick={() => triggerAiPrediction(formData.title, formData.description)}
              disabled={aiLoading || (!formData.title && !formData.description)}
            >
              {aiLoading ? (
                <>
                  <RotateCw size={13} className="spin-slow mr-1" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkle size={13} className="mr-1 text-primary" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
          <textarea
            name="description"
            required
            rows={4}
            maxLength={2000}
            placeholder="Type specifics about what is broken, spark hazards, leaking water, Wi-Fi outage, etc..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        {/* AI Suggestion Banner (Never silently overrides) */}
        {aiLoading && (
          <div className="ai-suggestion-box ai-suggestion-loading">
            <RotateCw size={18} className="spin-slow text-primary mr-2" />
            <span>Analyzing text using Multinomial Naive Bayes ML model...</span>
          </div>
        )}

        {aiPrediction && !aiLoading && (
          <div className="ai-suggestion-box">
            <div className="ai-suggestion-header">
              <div className="ai-badge-header">
                <Cpu size={16} className="text-primary mr-1" />
                <span className="ai-badge-title">AI Suggestion (Machine Learning)</span>
              </div>
              <span className="ai-badge-model">Naive Bayes &bull; TF-IDF</span>
            </div>

            <div className="ai-suggestion-content">
              <div className="ai-recommendation-row">
                <div className="ai-rec-item">
                  <span className="ai-rec-label">Suggested Category:</span>
                  <span className="ai-rec-value">
                    <strong>{aiPrediction.predictedCategory}</strong>
                    <span className="ai-confidence-pill">
                      {aiPrediction.categoryConfidence}% Confidence
                    </span>
                  </span>
                </div>

                <div className="ai-rec-item">
                  <span className="ai-rec-label">Recommended Urgency:</span>
                  <span className="ai-rec-value">
                    <strong>{aiPrediction.predictedPriority}</strong>
                    <span className="ai-confidence-pill ai-urgency-pill">
                      {aiPrediction.priorityConfidence}% (Recommendation)
                    </span>
                  </span>
                </div>
              </div>

              {aiPrediction.detectedKeywords && aiPrediction.detectedKeywords.length > 0 && (
                <div className="ai-keywords-row">
                  <span className="ai-keywords-label">Detected Keywords:</span>
                  <div className="ai-keywords-tags">
                    {aiPrediction.detectedKeywords.map((kw, i) => (
                      <span key={i} className="ai-keyword-tag">#{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {aiPrediction.priorityRationale && (
                <p className="ai-rationale-text">
                  <Info size={13} className="mr-1" />
                  {aiPrediction.priorityRationale}
                </p>
              )}
            </div>

            <div className="ai-suggestion-footer">
              <div className="ai-note-text">
                Your manual selection is always respected. Click below to apply these suggestions.
              </div>

              <button
                type="button"
                className={`btn btn-sm ${appliedSuggestion ? 'btn-success' : 'btn-primary'}`}
                onClick={handleApplySuggestion}
              >
                {appliedSuggestion ? (
                  <>
                    <Check size={14} className="mr-1" /> Suggestion Applied!
                  </>
                ) : (
                  <>
                    <Sparkle size={14} className="mr-1" /> Apply AI Suggestion
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {aiError && (
          <div className="ai-error-banner">
            <Info size={14} className="mr-1" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Category Selection */}
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Issue Category *</label>
            <span className="form-hint">Click to change manually</span>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              const isAiSuggested = aiPrediction && aiPrediction.predictedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-card ${isSelected ? 'selected' : ''} ${isAiSuggested && !isSelected ? 'ai-suggested-highlight' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <div className="category-icon">
                    <Icon size={22} />
                  </div>
                  <div className="category-text">
                    <div className="category-name-row">
                      <span className="category-name">{cat.label}</span>
                      {isAiSuggested && (
                        <span className="ai-chip-pill">AI Suggested</span>
                      )}
                    </div>
                    <span className="category-hint">{cat.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority & Location */}
        <div className="form-row">
          <div className="form-group flex-1">
            <div className="form-label-row">
              <label className="form-label">Urgency Level</label>
              {aiPrediction && (
                <span className="form-hint">AI recommends: {aiPrediction.predictedPriority}</span>
              )}
            </div>
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

          <div className="form-group flex-2">
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
