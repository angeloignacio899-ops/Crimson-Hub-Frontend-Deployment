import React from 'react';
import { XCircle } from 'lucide-react';

const ApprovalItem = ({ title, department, date }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0">
    <div>
      <p className="font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{department}</p>
      <p className="text-xs text-gray-400 mt-1">{date}</p>
    </div>
    <div className="flex space-x-3">
    </div>
  </div>
);

const PendingApprovals = ({ pendingItems, loading }) => {
  if (loading) return <p className="text-gray-500">Loading pending approvals...</p>;

  if (!pendingItems || pendingItems.length === 0)
    return <p className="text-gray-500">No pending approvals</p>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
        <a href="/admin/pendingapprovalpage" className="text-sm font-medium text-red-600 hover:text-red-700">
          View All
        </a>
      </div>

      {pendingItems.map((item) => (
        <ApprovalItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default PendingApprovals;
