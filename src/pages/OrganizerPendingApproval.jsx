// pages/EventManagement.jsx
import React, { useState } from "react";
import Header from "../components/organizer/layout/OrganizerHeader";
import Sidebar from "../components/organizer/layout/OrganizerSidebar";
import OrganizerTable from "../components/organizer/pending_approvals/PendingTable";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const OrganizerPendingApproval = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>

          </div>

          {/* Search + Filters */}
          <OrganizerTable />

        </main>
      </div>
    </div>
  );
};

export default OrganizerPendingApproval;
