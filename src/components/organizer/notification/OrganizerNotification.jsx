import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Calendar, Megaphone, X, ChevronRight } from 'lucide-react';
import axios from 'axios';

// --- API Call ---
const fetchNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const { data } = await axios.get(window.API_BASE + "/api/notifications", {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  return data;
};

// --- Notification Item ---
const NotificationItem = ({ notification, onClick }) => {
  const isApproved = notification.status?.toLowerCase() === 'approved';

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isApproved
          ? 'border-l-4 border-l-green-500 hover:border-green-200'
          : 'border-l-4 border-l-red-500 hover:border-red-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div
            className={`mt-1 p-3 rounded-full flex-shrink-0 ${
              isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {notification.type === 'Event' ? <Calendar size={20} /> : <Megaphone size={20} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-red-700 transition-colors line-clamp-1">
                {notification.title}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                  isApproved
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {notification.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{notification.description}</p>
            <p className="text-xs text-gray-400 mt-2">{notification.created_at}</p>
          </div>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-red-500 transition-colors" />
      </div>
    </div>
  );
};

// --- Notification Modal ---
const NotificationModal = ({ notification, onClose }) => {
  if (!notification) return null;

  console.log("NOTIFICATION DATA:", notification);

  const isApproved = notification.status?.toLowerCase() === 'approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {notification.type === 'Event' ? <Calendar size={20} className="text-red-600" /> : <Megaphone size={20} className="text-red-600" />}
            Notification Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{notification.title}</h3>
            <p className="text-sm text-gray-500">{notification.created_at}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Description & Details</h4>
            <p className="text-gray-600 text-sm">{notification.description}</p>
            {notification.details && (
              <p className="text-gray-600 text-sm italic mt-2">"{notification.details}"</p>
            )}
          </div>

          <div className={`p-4 rounded-xl border flex gap-4 ${isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`mt-1 p-2 rounded-full h-fit ${isApproved ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
              {isApproved ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div>
              <h4 className={`font-bold ${isApproved ? 'text-green-800' : 'text-red-800'}`}>
                {isApproved ? `Your ${notification.type} has been Approved!` : `Your ${notification.type} was Rejected`}
              </h4>
              <p className={`text-sm mt-1 ${isApproved ? 'text-green-700' : 'text-red-700'}`}>
                {isApproved
                  ? "You can now proceed with the next steps. It is live on the student dashboard."
                  : "Please review the feedback and update your proposal."
                }
              </p>

              {/* Remarks Section */}
              {notification.remarks && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    isApproved
                      ? "text-green-600"
                      : notification.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  <span className="font-semibold">Remarks: </span>
                  {notification.remarks}
                </p>
              )}

              {!isApproved && notification.rejectionNote && (
                <div className="mt-3 bg-white bg-opacity-60 p-3 rounded-lg border border-red-200 text-sm text-red-800">
                  <span className="font-bold">Note from Admin:</span> {notification.rejectionNote}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const OrganizerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login to see notifications.");
      return;
    }
    loadNotifications();
  }, []);

  const filteredData = notifications.filter(item => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        <div className="flex gap-3 mb-6">
          {['All', 'Event', 'Announcement'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}s
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredData.map(notif => (
            <NotificationItem key={notif.notification_id} notification={notif} onClick={setSelectedNotification} />
          ))}
          {filteredData.length === 0 && !error && (
            <div className="text-center py-20 text-gray-400">
              <Bell size={48} className="mx-auto mb-4 opacity-20"/>
              <p>No notifications found.</p>
            </div>
          )}
        </div>
      </main>

      {selectedNotification && (
        <NotificationModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
      )}
    </div>
  );
};

export default OrganizerNotification;
