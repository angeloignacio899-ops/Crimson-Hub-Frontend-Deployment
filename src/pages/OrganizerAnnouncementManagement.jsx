import React, { useState, useEffect } from "react";
import Header from "../components/organizer/layout/OrganizerHeader";
import Sidebar from "../components/organizer/layout/OrganizerSidebar";
import AnnouncementTable from "../components/organizer/announcementmanagement/AnnouncementTable";
import EventFilters from "../components/organizer/announcementmanagement/AnnouncementFilters";
import AnnouncementDetailModal from "../components/organizer/announcementmanagement/AnnouncementDetailModal";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const AnnouncementManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = { name: "John", role: "Organizer" };

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(window.API_BASE + "/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch announcements");

        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements based on search and category
  const filteredAnnouncements = announcements.filter((announcement) => {
    const search = searchTerm.toLowerCase();
    const category = (announcement.category || "").toLowerCase();
    const matchesSearch =
      announcement.title?.toLowerCase().includes(search) ||
      announcement.author?.toLowerCase().includes(search);
    const matchesCategory = categoryFilter === "all" || category === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const openModal = (announcementId) => setSelectedAnnouncementId(announcementId);
  const closeModal = () => setSelectedAnnouncementId(null);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header user={user} toggleSidebar={toggleSidebar} />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Announcement Management</h1>
            <button
              onClick={() => navigate("/organizer/announcementmanagement/submission")}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition"
            >
              <Plus size={20} className="mr-1" />
              Create Announcement
            </button>
          </div>

          {/* Search + Filters */}
          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />

          {/* Error / Empty State */}
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {!error && filteredAnnouncements.length === 0 && (
            <div className="text-gray-400 text-center py-20">
              <p>No announcements found.</p>
            </div>
          )}

          {/* Announcement Table */}
          {filteredAnnouncements.length > 0 && (
            <AnnouncementTable onView={openModal} announcements={filteredAnnouncements} />
          )}
        </main>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncementId && (
        <AnnouncementDetailModal
          announcementId={selectedAnnouncementId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AnnouncementManagement;
