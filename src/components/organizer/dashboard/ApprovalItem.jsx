import React from 'react';
import { XCircle } from 'lucide-react';

const ApprovalItem = ({ title, organization, date }) => (
  <div className="flex justify-between items-center py-4 border-b last:border-b-0">
    <div>
      <p className="text-gray-800 font-medium">{title}</p>
      <p className="text-sm text-gray-500 mt-1">
        {organization} <span className="mx-2">•</span> {date}
      </p>
    </div>
    <button className="text-red-400 hover:text-red-600 transition duration-150">
      <XCircle size={24} />
    </button>
  </div>
);

export default ApprovalItem;
