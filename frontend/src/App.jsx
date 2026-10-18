import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintsList } from './components/ComplaintsList';
import { AdminDashboard } from './components/AdminDashboard';
import { api } from './services/api';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('submit');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaints(filters);
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleComplaintSubmitted = () => {
    fetchComplaints();
    fetchStats();
  };

  const handleStatusUpdate = async (id, updateData) => {
    try {
      await api.updateStatus(id, updateData);
      await fetchComplaints();
      await fetchStats();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete complaint #${id}?`)) {
      return;
    }
    try {
      await api.deleteComplaint(id);
      await fetchComplaints();
      await fetchStats();
    } catch (err) {
      alert('Failed to delete complaint: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={stats ? stats.pending : 0}
      />

      <main className="main-content">
        {activeTab === 'submit' && (
          <ComplaintForm
            onComplaintSubmitted={handleComplaintSubmitted}
            onViewComplaints={() => setActiveTab('list')}
          />
        )}

        {activeTab === 'list' && (
          <ComplaintsList
            complaints={complaints}
            loading={loading}
            onRefresh={() => {
              fetchComplaints();
              fetchStats();
            }}
            filters={filters}
            setFilters={setFilters}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            onStatusUpdate={() => {
              fetchComplaints();
              fetchStats();
            }}
            onDelete={() => {
              fetchComplaints();
              fetchStats();
            }}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title">CampusPulse &bull; Smart Campus Complaint Management System</p>
          <p className="footer-sub">Designed for BTech CSE Project Evaluation &bull; React + Spring Boot 3 + MySQL</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
