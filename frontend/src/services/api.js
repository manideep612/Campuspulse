const API_BASE_URL = 'http://localhost:8080/api/complaints';

export const api = {
  // Fetch all complaints with optional filters
  async getComplaints(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}${queryString}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  // Fetch single complaint by ID
  async getComplaintById(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Complaint not found');
    return res.json();
  },

  // Submit a new complaint
  async createComplaint(complaintData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.details
        ? Object.values(errorData.details).join(', ')
        : errorData.error || 'Failed to submit complaint';
      throw new Error(message);
    }
    return res.json();
  },

  // Admin: Update complaint status & remarks
  async updateStatus(id, statusData) {
    const res = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    if (!res.ok) throw new Error('Failed to update complaint status');
    return res.json();
  },

  // Admin: Delete complaint
  async deleteComplaint(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete complaint');
    return true;
  },

  // Fetch dashboard stats
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Track complaints by student roll number
  async getByStudentRollNo(rollNo) {
    const res = await fetch(`${API_BASE_URL}/student/${encodeURIComponent(rollNo)}`);
    if (!res.ok) throw new Error('Failed to fetch student complaints');
    return res.json();
  }
};
