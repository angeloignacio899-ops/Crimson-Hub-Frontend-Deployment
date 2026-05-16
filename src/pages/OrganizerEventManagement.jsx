// pages/EventManagement.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/organizer/layout/OrganizerHeader";
import Sidebar from "../components/organizer/layout/OrganizerSidebar";
import EventTable from "../components/organizer/eventmanagement/EventTable";
import EventFilters from "../components/organizer/eventmanagement/EventFilters";
import EventDetailModal from "../components/organizer/eventmanagement/EventDetailModal"; 
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const EventManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // all / academic / non-academic
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = {
    name: "John",
    role: "Organizer" // could be "Admin" for admin users
  };

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(window.API_BASE + "/api/events", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch events");

        setEvents(data); // backend already filtered based on role
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  // Filtered events based on search + category
  const filteredEvents = events.filter(event => {
    const search = searchTerm.toLowerCase();
    const eventCategory = (event.category_name || event.category || '').toLowerCase();

    const matchesSearch =
      event.title?.toLowerCase().includes(search) ||
      event.organizer_name?.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === 'all' || eventCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // --------------------------
    // View Button Handler
    // --------------------------
    const openModal = (eventId) => {
        setSelectedEventId(eventId);
    };

    // --------------------------
    // CLOSE MODAL FUNCTION (Fix!)
    // --------------------------
    const closeModal = () => {
        setSelectedEventId(null);
    };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header user={user} toggleSidebar={toggleSidebar} />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>

            <button
              onClick={() => navigate("/organizer/eventmanagement/submission")}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition"
            >
              <Plus size={20} className="mr-1" />
              Create Event
            </button>
          </div>

          {/* Search + Filters */}
          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />

          {/* Event Table — now with modal trigger */}
          <EventTable onViewEvent={openModal} events={filteredEvents} />
        </main>
      </div>

      {/* Event Detail Modal */}
      {selectedEventId && (
        <EventDetailModal eventId={selectedEventId} onClose={closeModal} />
      )}
    </div>
  );
};

export default EventManagement;
