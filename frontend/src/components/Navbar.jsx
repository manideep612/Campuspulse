import React from 'react';
import { ShieldCheck, PlusCircle, LayoutList, Activity, Building2 } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, pendingCount }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab('submit')}>
          <div className="brand-icon">
            <Activity size={24} color="#ffffff" />
          </div>
          <div className="brand-text">
            <span className="brand-title">CampusPulse</span>
            <span className="brand-subtitle">Smart Campus Complaint System</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <PlusCircle size={18} />
            <span>New Complaint</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <LayoutList size={18} />
            <span>All Complaints</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
            {pendingCount > 0 && (
              <span className="nav-badge">{pendingCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
