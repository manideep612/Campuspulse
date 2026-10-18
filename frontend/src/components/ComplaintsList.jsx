import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RotateCw, 
  AlertCircle, 
  Inbox,
  UserCheck
} from 'lucide-react';
import { ComplaintCard } from './ComplaintCard';

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'ELECTRICITY', label: 'Electricity' },
  { id: 'WATER', label: 'Water' },
  { id: 'CLEANLINESS', label: 'Cleanliness' },
  { id: 'FURNITURE', label: 'Furniture' },
  { id: 'INTERNET', label: 'Internet' },
  { id: 'OTHER', label: 'Other' },
];

const STATUSES = [
  { id: '', label: 'All Statuses' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
];

export function ComplaintsList({ 
  complaints, 
  loading, 
  onRefresh, 
  filters, 
  setFilters,
  onStatusUpdate,
  onDelete
}) {
  const [rollNoSearch, setRollNoSearch] = useState('');

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleRollNoSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: rollNoSearch }));
  };

  const clearRollNoSearch = () => {
    setRollNoSearch('');
    setFilters((prev) => ({ ...prev, search: '' }));
  };

  return (
    <div className="list-container">
      {/* Top Controls Header */}
      <div className="list-header">
        <div>
          <h2 className="section-title">Campus Complaints Hub</h2>
          <p className="section-desc">
            Browse, filter, and track status updates for all reported campus issues.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RotateCw size={15} className={`mr-1 ${loading ? 'spin-slow' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by keywords, room, issue title, or roll no..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <form onSubmit={handleRollNoSearch} className="rollno-tracker-form">
            <input
              type="text"
              placeholder="Filter by Roll No (e.g. 21BCSE042)"
              value={rollNoSearch}
              onChange={(e) => setRollNoSearch(e.target.value)}
              className="rollno-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <UserCheck size={14} className="mr-1" /> Track
            </button>
            {rollNoSearch && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearRollNoSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-row">
          <div className="filter-group">
            <span className="filter-label">Category:</span>
            <div className="pill-group">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${(filters.category || '') === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <div className="pill-group">
              {STATUSES.map((st) => (
                <button
                  key={st.id}
                  className={`filter-pill ${(filters.status || '') === st.id ? 'active' : ''}`}
                  onClick={() => handleStatusChange(st.id)}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Grid / Results */}
      {loading ? (
        <div className="loading-state">
          <RotateCw size={32} className="spin-slow text-primary mb-2" />
          <p>Loading complaints from database...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} className="empty-icon" />
          <h3>No Complaints Found</h3>
          <p>There are no complaints matching your selected criteria.</p>
          {(filters.search || filters.category || filters.status) && (
            <button
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => {
                setFilters({ category: '', status: '', search: '' });
                setRollNoSearch('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              isAdmin={false}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
