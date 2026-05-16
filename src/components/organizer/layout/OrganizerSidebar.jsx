import React from 'react';
import { X, Briefcase, LayoutDashboard, Calendar, Bell, Users, Clock, BellRing, Settings, LogOut } from 'lucide-react';
import NavLink from './NavLink';

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <>
    <div
      className={`fixed inset-0 z-20 bg-opacity-0 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
      onClick={toggleSidebar}
    ></div>

    <div
      className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-red-700 p-4 transition-transform duration-300 ease-in-out z-30
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex items-center mt-5 mb-10">
        <Briefcase className="w-8 h-8 text-white mr-2" />
        <h1 className="text-xl font-bold text-white">Crimson Event Hub</h1>
        <button className="ml-auto text-white lg:hidden" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-2">
        <NavLink icon={LayoutDashboard} label="Dashboard" to="/organizer/dashboard" />
        <NavLink icon={Calendar} label="My Events" to="/organizer/eventmanagement" />
        <NavLink icon={Bell} label="My Announcements" to="/organizer/announcementmanagement" />
        <NavLink icon={Users} label="Attendees" to="/organizer/registrationmanagement" />
        <NavLink icon={Clock} label="Pending Approvals" to="/organizer/pending_approval" />
        <NavLink icon={BellRing} label="Notifications" to="/organizer/notification" />
        <NavLink icon={Settings} label="Settings" to="/organizer/settings" />
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <NavLink icon={LogOut} label="Logout" to="/login" />
      </div>
    </div>
  </>
);

export default Sidebar;
