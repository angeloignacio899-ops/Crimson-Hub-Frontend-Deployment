import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Megaphone, Users, Settings, LogOut, FileClock } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.jpg"; 
import { useUser } from "../../context/UserContext";
import EditAdminModal from './EditAdminModal';

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditProfile = () => setIsEditModalOpen(true);
    const handleCloseModal = () => setIsEditModalOpen(false);

    const navLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, active: true, path: '/admin/dashboard' },
        { name: 'Events', icon: Calendar, active: false, path: '/admin/eventpage' },
        { name: 'Announcements', icon: Megaphone, active: false, path: '/admin/announcementpage' },
        { name: 'Users', icon: Users, active: false, path: '/admin/userpage' },
        { name: 'Pending Approvals', icon: FileClock, active: false, path: '/admin/pendingapprovalpage' },
        { name: 'Settings', icon: Settings, active: false, path: '/admin/settingspage' },
    ];

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="w-64 bg-gradient-to-br from-[#C8102E] to-[#a00e25] shadow-xl flex flex-col p-4">

            {/* Logo */}
            <div className="flex items-center space-x-2 py-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Crimson Events Hub Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-semibold text-white">Crimson Events Hub</span>
            </div>

            {/* User Card */}
            <div className="bg-red-600 rounded-lg p-4 mb-8 relative text-white flex flex-col items-center">
                <button
                    onClick={handleEditProfile}
                    className="absolute top-2 right-2 text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition"
                    title="Edit Profile"
                >
                    Edit
                </button>

                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-white/30 text-xl font-bold mb-3">
                    {user?.profile_image ? (
                        <img
                            src={`${window.API_BASE}${user.profile_image}`}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        user?.lastname?.charAt(0)?.toUpperCase() || "A"
                    )}
                </div>

                <p className="font-semibold">{user ? `${user.firstname} ${user.lastname}` : "Admin Name"}</p>
                <p className="text-sm opacity-80">Administrator</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navLinks.map((item) => (
                    <NavLink
                    key={item.name}
                    to={item.path || `/${item.name.toLowerCase()}`}
                    className={({ isActive }) =>
                        `flex items-center w-full text-left space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                            ? "bg-red-50 text-red-600 font-medium"
                            : "text-white hover:bg-red-50 hover:text-red-600"
                        }`
                    }
                    >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-3 p-3 rounded-lg transition-colors text-white hover:bg-red-50 hover:text-red-600 font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Edit Admin Modal */}
            {isEditModalOpen && (
                <EditAdminModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    user={user}        // pass current user info
                    setUser={setUser}  // modal updates Sidebar instantly
                />
            )}
        </div>
    );
};

export default Sidebar;
