import React, { useState } from 'react';
import Sidebar from '../components/organizer/layout/OrganizerSidebar';
import Header from '../components/organizer/layout/OrganizerHeader';
import DashboardContent from '../components/organizer/dashboard/OrganizerDashboardContent';

const OrganizerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userProfile = { name: "John", role: "Organizer" };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex max-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Header user={userProfile} toggleSidebar={toggleSidebar} />
        <DashboardContent />
      </div>
    </div>
  );
};

export default OrganizerDashboard;
