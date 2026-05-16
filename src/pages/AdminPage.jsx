import { useEffect, useState } from "react";
import { Users, Calendar, Megaphone, CheckCircle } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';
import HeaderStats from '../components/admin/HeaderStats';
import PendingApprovals from '../components/admin/PendingApprovals';
import RecentActivity from '../components/admin/RecentActivity';
import RecentSubmissions from '../components/admin/RecentSubmissions';
import QuickAction from '../components/common/QuickAction';
import DashboardCalendar from "../components/admin/AdminCalendar";
import { useUser } from '../context/UserContext';
import { useError } from '../context/ErrorContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUser();
  const { showError } = useError();
  const navigate = useNavigate();

  const [allPendingCount, setAllPendingCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [pendingItems, setPendingItems] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [approvedEvents, setApprovedEvents] = useState(0);
  const [approvedAnnouncements, setApprovedAnnouncements] = useState(0);


  // --- Fetch Active Users ---
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(window.API_BASE + "/api/user/count-active", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActiveUsers(res.data.activeUsers || 0);
      } catch (err) {
        showError("Failed to load active users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchActiveUsers();
  }, []);

  // --- Fetch Pending Approvals ---
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        setLoadingPending(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(window.API_BASE + "/api/pending", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Pending approvals API response:", res.data);

        // Determine the array safely
        // Determine the array safely
        const dataArray = Array.isArray(res.data.items)
        ? res.data.items
        : Array.isArray(res.data)
        ? res.data
        : [];

        // Filter all pending
        const allPending = dataArray.filter(item => item.status === "Pending");

        // Save total pending count
        setAllPendingCount(allPending.length);

        // Only show top 3 in the card
        const recentPending = allPending
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map(item => ({
            id: item.id || item._id,
            title: item.title,
            department: item.department || item.type || "N/A",
            date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
                })
            : "N/A"
        }));



        console.log("Top 3 pending:", recentPending);

        setPendingItems(recentPending);
      } catch (err) {
        showError("Failed to load pending approvals");
        setPendingItems([]);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingApprovals();

    const interval = setInterval(fetchPendingApprovals, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
    const fetchApprovedCounts = async () => {
        try {
        const token = localStorage.getItem("token");

        // ---------------------
        // 1️⃣ GET APPROVED EVENTS
        // ---------------------
        const eventRes = await axios.get(window.API_BASE + "/api/events", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const approvedEventsList = eventRes.data.filter(
            item => item.status?.toLowerCase() === "approved"
        );

        setApprovedEvents(approvedEventsList.length);

        // ---------------------
        // 2️⃣ GET APPROVED ANNOUNCEMENTS
        // ---------------------
        const annRes = await axios.get(window.API_BASE + "/api/announcements/approved");

        // These already come filtered — but do a safety filter
        const approvedAnnouncementsList = annRes.data.filter(
            item => item.approval_status === "Approved"
        );

        setApprovedAnnouncements(approvedAnnouncementsList.length);

        } catch (err) {
        showError("Failed to load approval counts");
        }
    };

    fetchApprovedCounts();
    }, []);



  // --- Header Stats ---
  const headerData = [
  { 
    title: 'Event Created', 
    value: approvedEvents, 
    icon: Calendar, 
    color: 'bg-blue-100/50 text-blue-800' 
  },

  { 
    title: 'Announcements', 
    value: approvedAnnouncements, 
    icon: Megaphone, 
    color: 'bg-pink-100/50 text-pink-800' 
  },

  { 
    title: 'Pending Reviews', 
    value: allPendingCount, 
    icon: CheckCircle, 
    color: 'bg-green-100/50 text-green-800' 
  },

  { 
    title: 'Active Users', 
    value: loadingUsers ? "..." : activeUsers, 
    icon: Users, 
    color: 'bg-red-100/50 text-red-800' 
  },
];


  // --- Static Calendar Events ---
  const eventsData = [
    { id: 1, title: "Rave Party", date: "2025-11-25", type: "Event" },
    { id: 2, title: "Holiday Announcement", date: "2025-11-30", type: "Announcement" },
    { id: 3, title: "Hackathon", date: "2025-11-28", type: "Event" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Hello {user ? `${user.firstname} ${user.lastname}` : "Admin Name"}!
        </h1>
        <p className="text-gray-500 mb-8">Here's what's happening with your events today.</p>

        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {headerData.map((data, index) => (
            <div
            key={index}
            onClick={() => {
                if (data.title === "Event Created") navigate("/admin/eventpage");
                if (data.title === "Announcements") navigate("/admin/announcementpage");
                if (data.title === "Active Users") navigate("/admin/userpage");
                if (data.title === "Pending Reviews") navigate("/admin/pendingapprovalpage");
            }}
            className="cursor-pointer"
            >
            <HeaderStats {...data} />
            </div>
        ))}
        </div>


        {/* Pending Approvals, Recent Activity, Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            <PendingApprovals pendingItems={pendingItems} loading={loadingPending} />
          </div>
          <div className="lg:col-span-1">
            <DashboardCalendar events={eventsData} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <QuickAction />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
