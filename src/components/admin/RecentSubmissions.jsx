// RecentSubmissions.jsx

import React from 'react';
import { ChevronRight } from 'lucide-react';

const SubmissionItem = ({ title, submitter, department, date, status }) => {
    const statusClasses = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };

    return (
        <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition duration-150 rounded-lg">
            <div>
                <p className="font-medium text-gray-700">{title}</p>
                <p className="text-sm text-gray-500">
                    {submitter} • {department}
                </p>
                <p className="text-xs text-gray-400 mt-1">{date}</p>
            </div>
            <div className="flex items-center space-x-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[status]}`}>
                    {status}
                </span>
                <ChevronRight size={18} className="text-gray-400" />
            </div>
        </div>
    );
};

const RecentSubmissions = () => {
    const submissions = [
        { title: 'University Week', submitter: 'Juancho Alex Montero', department: 'CSC', date: 'Oct 29, 2025', status: 'PENDING' },
        { title: 'Research Symposium', submitter: 'Prof. Riquel Jameson Alboja', department: 'Engineering', date: 'Oct 28, 2025', status: 'PENDING' },
        { title: 'Guest Lecture/ Seminar', submitter: 'Student Affairs', department: 'Student Services', date: 'Oct 27, 2025', status: 'PENDING' },
        { title: 'Graduation Ceremony', submitter: 'Registrar Office', department: 'Admin', date: 'Oct 26, 2025', status: 'APPROVED' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Submissions</h2>
                <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">
                    View All
                </a>
            </div>
            <div className="space-y-1">
                {submissions.map((item, index) => (
                    <SubmissionItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default RecentSubmissions;