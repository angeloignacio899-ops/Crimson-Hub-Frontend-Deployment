// RecentActivity.jsx

import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'APPROVED':
            return <CheckCircle size={20} className="text-green-500" />;
        case 'REJECTED':
            return <XCircle size={20} className="text-red-600" />;
        case 'PENDING':
            return <Clock size={20} className="text-yellow-500" />;
        default:
            return null;
    }
};

const ActivityItem = ({ title, status }) => {
    return (
        <div className="flex items-center justify-between py-3 border-b last:border-b-0">
            <p className="text-gray-700">{title}</p>
            <div className={`text-sm font-medium flex items-center space-x-2`}>
                <StatusIcon status={status} />
                <span className={`hidden sm:inline ${
                    status === 'APPROVED' ? 'text-green-600' :
                    status === 'REJECTED' ? 'text-red-600' :
                    'text-yellow-600'
                }`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

const RecentActivity = () => {
    const activities = [
        { title: 'Thesis Defense Schedule', status: 'APPROVED' },
        { title: 'Sports Tournament', status: 'REJECTED' },
        { title: 'Semester Registration', status: 'PENDING' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">
                    View All
                </a>
            </div>
            <div className="space-y-2">
                {activities.map((item, index) => (
                    <ActivityItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;