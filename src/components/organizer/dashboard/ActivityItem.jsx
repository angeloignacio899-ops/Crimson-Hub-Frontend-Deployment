import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const ActivityItem = ({ title, status, statusColor }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-b-0">
    <p className="text-gray-700">{title}</p>
    <div className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
      {status === "APPROVED" && <CheckCircle size={14} className="mr-1" />}
      {status === "REJECTED" && <XCircle size={14} className="mr-1" />}
      {status === "PENDING" && <Clock size={14} className="mr-1" />}
      {status}
    </div>
  </div>
);

export default ActivityItem;
