import React, { useState } from 'react';

const MySubmissions = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const submissions = [
    {
      id: 1,
      title: 'CCS Tech Workshop Series',
      type: 'Event',
      category: 'Academic',
      submittedDate: 'October 12, 2025',
      status: 'Approved',
      statusColor: '#27AE60',
      approvedDate: 'October 16, 2025',
      eventDate: 'November 25, 2025',
      canEdit: false
    },
    {
      id: 2,
      title: 'Blood Donation Drive Announcement',
      type: 'Announcement',
      category: 'Organization',
      submittedDate: 'October 18, 2025',
      status: 'Pending',
      statusColor: '#F39C12',
      eventDate: 'November 10, 2025',
      canEdit: true
    },
    {
      id: 3,
      title: 'Student Council Elections',
      type: 'Event',
      category: 'Council Events',
      submittedDate: 'October 12, 2025',
      status: 'Rejected',
      statusColor: '#E74C3C',
      rejectedDate: 'October 15, 2025',
      feedback: 'The proposed event date conflicts with the midterm examination period. Please reschedule to a date after November 5, 2025',
      canEdit: false
    },
    {
      id: 4,
      title: 'Basketball Tournament Finals',
      type: 'Event',
      category: 'Sports',
      submittedDate: 'October 20, 2025',
      status: 'Pending',
      statusColor: '#F39C12',
      eventDate: 'December 5, 2025',
      canEdit: true
    },
    {
      id: 5,
      title: 'Information Technology Week 2025',
      type: 'Announcement',
      category: 'Academic',
      submittedDate: 'October 8, 2025',
      status: 'Approved',
      statusColor: '#27AE60',
      approvedDate: 'October 9, 2025',
      eventDate: 'October 13, 2025',
      canEdit: false
    }
  ];

  const filteredSubmissions = activeFilter === 'All'
    ? submissions
    : submissions.filter(s => s.status === activeFilter);
  
  const statusCounts = {
    All: submissions.length,
    Pending: submissions.filter(s => s.status === 'Pending').length,
    Approved: submissions.filter(s => s.status === 'Approved').length,
    Rejected: submissions.filter(s => s.status === 'Rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <section className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">My Submissions</h2>
            <p className="text-sm text-gray-600">Track the status of your submitted events and announcements</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
            + New Submission
          </button>
        </section>

        <div className="bg-white rounded-lg p-2 shadow-sm mb-6 flex gap-2">
          {[
            { key: 'All', label: 'All', count: statusCounts.All, icon: '📋' },
            { key: 'Pending', label: 'Pending', count: statusCounts.Pending, icon: '⏳' },
            { key: 'Approved', label: 'Approved', count: statusCounts.Approved, icon: '✅' },
            { key: 'Rejected', label: 'Rejected', count: statusCounts.Rejected, icon: '❌' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeFilter === tab.key 
                  ? 'bg-red-600 text-white' 
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div 
              key={submission.id} 
              className={`bg-white rounded-lg p-6 shadow-sm transition ${
                submission.status === 'Pending' ? 'border-2 border-yellow-500' : 'border-2 border-transparent'
              }`}
            >
              <div className="w-full flex justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-800">{submission.title}</h3>
                <span 
                  className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-tight"
                  style={{
                    backgroundColor: `${submission.statusColor}15`,
                    color: submission.statusColor
                  }}
                >
                  {submission.status}
                </span>
                </div>

                <div className="flex gap-4 justify-end">
                <button className="px-4 py-2 bg-transparent border border-blue-500 text-blue-600 rounded text-xs font-semibold hover:bg-blue-50 transition">
                  View Details
                </button>

                {submission.canEdit && (
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600 transition">
                    Edit
                  </button>
                )}
              </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
                <span>{submission.type}</span>
                <span>•</span>
                <span>{submission.category}</span>
                <span>•</span>
                <span>Submitted: {submission.submittedDate}</span>
                {submission.eventDate && (
                  <>
                    <span>•</span>
                    <span>Event Date: {submission.eventDate}</span>
                  </>
                )}
              </div>

              {submission.status === 'Approved' && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-600 rounded mb-4">
                  <p className="text-xs text-green-800 font-semibold mb-1"> Approved on {submission.approvedDate}</p>
                  <p className="text-xs text-green-700">Your submission has been approved and published. Users can now view and register for this event.</p>
                </div>
              )}

              {submission.status === 'Pending' && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
                  <p className="text-xs text-yellow-800 font-semibold mb-1"> Awaiting Admin Review</p>
                  <p className="text-xs text-yellow-700">Your submission is currently under review. You'll be notified once an admin approves or provides feedback.</p>
                </div>
              )}

              {submission.status === 'Rejected' && submission.feedback && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded mb-4">
                  <p className="text-xs text-red-800 font-semibold mb-2"> Rejected on {submission.rejectedDate}</p>
                  <p className="text-xs text-red-700 font-semibold mb-1">Admin Feedback:</p>
                  <p className="text-xs text-gray-700 mb-3 leading-relaxed">{submission.feedback}</p>
                  <button className="px-4 py-1.5 bg-transparent border border-red-600 text-red-600 rounded text-xs font-semibold hover:bg-red-50 transition">
                    Resubmit with Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MySubmissions;