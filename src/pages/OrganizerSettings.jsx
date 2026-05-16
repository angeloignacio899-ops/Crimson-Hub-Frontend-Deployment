// pages/EventManagement.jsx
import React, { useState } from "react";
import Header from "../components/organizer/layout/OrganizerHeader";
import Sidebar from "../components/organizer/layout/OrganizerSidebar";
import OrganizerSettingsContent from "../components/organizer/settings/OrganizerSettingsContent";
import { useNavigate } from "react-router-dom";

const OrganizerSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = {
    name: "John",
    role: "Organizer"
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        <Header user={user} toggleSidebar={toggleSidebar} />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <OrganizerSettingsContent />
        </main>
      </div>
    </div>
  );
};

export default OrganizerSettings;
