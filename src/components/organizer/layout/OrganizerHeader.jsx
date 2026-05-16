import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronRight } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();

  const backendURL = window.API_BASE + "";

  const handleProfileClick = () => setIsProfileOpen(!isProfileOpen);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // Avatar logic — FIXED WITH BACKEND URL
  const avatarContent = user.profile_image
    ? (
        <img
          src={`${backendURL}${user.profile_image}`}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-red-700"
        />
      )
    : (
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg border-2 border-red-700">
          {user.firstname?.[0]?.toUpperCase() || "U"}
        </div>
      );

  return (
    <header className="sticky top-0 z-10 bg-red-700 shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button className="lg:hidden p-2 mr-4 text-black" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <div className="relative flex items-center space-x-4" ref={profileRef}>
        <div
          className="flex items-center space-x-3 bg-gray-50 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition duration-150"
          onClick={handleProfileClick}
        >
          <div className="relative">
            {avatarContent}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user.firstname}</p>
            <p className="text-xs text-gray-500">{user.role || "Organizer"}</p>
          </div>

          <ChevronRight size={18} className="text-gray-500 hidden sm:block" />
        </div>

        {/* Profile Modal */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-65 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-4">
            <div className="flex flex-col items-center space-y-3">
              
              {user.profile_image ? (
                <img
                  src={`${backendURL}${user.profile_image}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-red-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-2xl border-2 border-red-700">
                  {user.firstname?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              <div className="text-center">
                <p className="font-semibold text-gray-800">{user.firstname} {user.lastname}</p>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">{user.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
