// pages/EventManagement.jsx
import React, { useState } from "react";
import Header from "../components/organizer/layout/OrganizerHeader";
import Sidebar from "../components/organizer/layout/OrganizerSidebar";
import EventSubmit from "../components/organizer/eventmanagement/OrganizerEventSubmision";

const EventManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = {
    name: "John",
    role: "Organizer"
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header user={user} toggleSidebar={toggleSidebar} />

        <main className="p-6">
          <EventSubmit />
        </main>
      </div>
    </div>
  );
};

export default EventManagement;
