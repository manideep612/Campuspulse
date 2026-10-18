import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export function StatusBadge({ status }) {
  switch (status) {
    case 'PENDING':
      return (
        <span className="badge badge-pending">
          <Clock size={13} className="mr-1" />
          Pending
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="badge badge-in-progress">
          <RefreshCw size={13} className="mr-1 spin-slow" />
          In Progress
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={13} className="mr-1" />
          Resolved
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
}

export function PriorityBadge({ priority }) {
  switch (priority) {
    case 'URGENT':
      return <span className="badge badge-priority-urgent">Urgent</span>;
    case 'HIGH':
      return <span className="badge badge-priority-high">High</span>;
    case 'MEDIUM':
      return <span className="badge badge-priority-medium">Medium</span>;
    case 'LOW':
      return <span className="badge badge-priority-low">Low</span>;
    default:
      return null;
  }
}
