import Navbar from "../components/common/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Calendar, Megaphone, Info } from "lucide-react";
import { useError } from "../context/ErrorContext";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Unread", "Events", "Announcements"];

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { showError } = useError();

  // Helper to map type to icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Event":
        return <Calendar className="text-red-500" size={24} />;
      case "Announcement":
        return <Megaphone className="text-orange-500" size={24} />;
      default:
        return <Info className="text-blue-500" size={24} />;
    }
  };

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(window.API_BASE + "/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only Event and Announcement
        const filtered = res.data
          .filter((n) => n.type === "Event" || n.type === "Announcement")
          .map((n) => ({
            id: n.notification_id,
            title: n.title,
            message: n.description || "",
            time: n.created_at,
            category: n.type,
            icon: getNotificationIcon(n.type),
            read: n.status === "read",
          }));

        setNotifications(filtered);
      } catch (err) {
        showError("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, [token]);

  // Real-time Socket.IO setup
  useEffect(() => {
    const socket = io(window.API_BASE + "");

    if (userId) {
      socket.emit("join", userId); // Join a room for this user
    }

    socket.on("newNotification", (notification) => {
      console.log("Received new notification:", notification);

      setNotifications((prev) => [
        {
          id: notification.notification_id,
          title: notification.title,
          message: notification.description || "",
          time: notification.created_at,
          category: notification.type,
          icon: getNotificationIcon(notification.type),
          read: false,
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await axios.put(
        `${window.API_BASE}/api/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${window.API_BASE}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${window.API_BASE}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications =
    activeCategory === "All"
      ? notifications
      : activeCategory === "Unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <section className="bg-gray-100 py-4 px-6 border-t border-[#d64553] justify-between rounded-lg flex items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            <p className="text-sm text-gray-500 mt-1">
              You have{" "}
              <span className="font-semibold text-red-700">{unreadCount}</span>{" "}
              {unreadCount === 1 ? "unread notification" : "unread notifications"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm font-semibold px-4 py-1.5 rounded-md transition"
            >
              Mark All as Read
            </button>
          )}
        </section>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const styles = isActive
              ? "bg-[#a22c36] text-white border-[#a22c36]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200";

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1 rounded-full text-sm font-medium border transition-all cursor-pointer ${styles}`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex justify-between items-start border rounded-lg p-4 transition ${
                n.read ? "bg-gray-50 border-gray-200" : "bg-white border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2">{n.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    {n.title}
                    {!n.read && <span className="text-red-500 text-lg">•</span>}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                  <div className="flex gap-3 mt-3">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="bg-blue-50 border border-blue-500 text-blue-600 text-sm px-3 py-1 rounded-md hover:bg-blue-100 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="border border-red-500 text-red-600 text-sm px-3 py-1 rounded-md hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">{n.time}</p>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <p className="text-center text-gray-500 py-10">No notifications found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
