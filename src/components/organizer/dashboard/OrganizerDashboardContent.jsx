import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import Calendar from '../../admin/AdminCalendar';
import { Calendar as CalendarIcon, Megaphone, Bell } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';

const DashboardContent = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  const [stats, setStats] = useState([
    { title: 'Events', count: 0, color: 'red', type: 'events', icon: CalendarIcon, route: '/organizer/eventmanagement' },
    { title: 'Announcements', count: 0, color: 'yellow', type: 'announcements', icon: Megaphone, route: '/organizer/announcementmanagement' },
    { title: 'Notifications', count: 0, color: 'blue', type: 'notifications', icon: Bell, route: '/organizer/notification' },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch all counts for stats
    const fetchEvents = fetch(window.API_BASE + '/api/events', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    const fetchAnnouncements = fetch(window.API_BASE + '/api/announcements', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    const fetchNotifications = fetch(window.API_BASE + '/api/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    // Fetch pending approvals using the unified endpoint
    const fetchPending = fetch(window.API_BASE + '/api/pending/user', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    Promise.all([fetchEvents, fetchAnnouncements, fetchNotifications, fetchPending])
      .then(([eventsData, announcementsData, notificationsData, pendingData]) => {
        // Update stats counts
        setStats(prevStats =>
          prevStats.map(stat => {
            switch (stat.type) {
              case 'events':
                return { ...stat, count: eventsData.length || 0 };
              case 'announcements':
                return { ...stat, count: announcementsData.length || 0 };
              case 'notifications':
                return { ...stat, count: notificationsData.length || 0 };
              default:
                return stat;
            }
          })
        );

        // Pending approvals (sorted newest first)
        const items = pendingData.items || [];
        items.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));

        // Show only 3 most recent
        setPendingApprovals(items.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Organizer Dashboard</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your events today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} onClick={() => handleCardClick(stat.route)} />
        ))}
      </div>

      {/* Pending Approvals & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Pending Approvals</h3>
              <button
                className="text-red-600 font-semibold text-sm hover:text-red-800 transition duration-150"
                onClick={() => navigate('/organizer/pending_approval')}
              >
                View All
              </button>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-2 gap-4 text-gray-500 font-semibold border-b border-gray-200 pb-2 mb-2">
              <span>Title</span>
              <span>Type</span>
            </div>

            {/* Pending Items */}
            <div className="divide-y divide-gray-100">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((item, index) => (
                  <div
                    key={index}
                    className="py-3 grid grid-cols-2 gap-4 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate(item.type === 'Event' ? `/organizer/eventmanagement` : `/organizer/announcementmanagement`)
                    }
                  >
                    <span className="font-medium text-gray-800">{item.title}</span>
                    <span className="text-sm text-gray-400">{item.type}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm py-4 text-center">No pending approvals</p>
              )}
            </div>
          </div>

        {/* Calendar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Calendar</h3>
          <Calendar onChange={setDate} value={date} className="modern-calendar" />
          <p className="mt-4 text-gray-600 text-sm text-center font-medium">
            Selected Date: {date.toDateString()}
          </p>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
