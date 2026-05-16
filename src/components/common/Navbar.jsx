import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import Button from "./Button";
import axios from "axios";
import {
  Search,
  LogOut,
  Contact,
  UserRound,
  Calendar,
  X,
} from "lucide-react";

export default function Navbar({ showSearchBar = false, setSearchQuery = null }) {
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(window.API_BASE + "/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  // Keep parent in sync when the local query changes (guarded)
  useEffect(() => {
    if (typeof setSearchQuery === "function") {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  const handleSearchClick = () => {
    if (window.innerWidth < 768) {
      setShowMobileSearch(true);
    } else {
      navigate("/events");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // ensure we have set the parent's query before navigating
    if (typeof setSearchQuery === "function") {
      setSearchQuery(query);
    }
    navigate("/events");
    setShowMobileSearch(false);
  };

  const handleProfile = () => {
    const role_id = Number(localStorage.getItem("role_id"));
    if (role_id === 1) {
      navigate("/user/profile");
    } else if (role_id === 2) {
      navigate("/organizer/profile");
    } else {
      navigate("/login");
    }
  };

  const handleAboutus = () => navigate("/about");
  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };
  const handleCalendar = () => navigate("/user/calendar");
  const handleNotification = () => navigate("/notificationpage");

  return (
    <>
      <header className="w-full bg-[#d64553] text-white py-2 px-4 sm:px-6 flex items-center justify-between shadow-md relative">
        {/* Left: Logo and title */}
        <Link to="/homepage" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-base sm:text-lg">
              CEH<span className="hidden sm:inline"> - Crimson Events Hub</span>
            </span>
            <span className="text-[10px] sm:text-xs tracking-wide text-[#ffdada]">
              WMSU EVENT MANAGEMENT
            </span>
          </div>
        </Link>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 relative" ref={menuRef}>

          {showSearchBar ? (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex items-center bg-white rounded-full px-3 py-1 w-48 sm:w-64"
            >
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // optionally update parent immediately (redundant with useEffect but fine)
                  if (typeof setSearchQuery === "function") setSearchQuery(e.target.value);
                }}
                placeholder="Search..."
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
              />
            </form>
          ) : (
            <Button
              onClick={handleSearchClick}
              className="bg-white text-[#d64553] p-2 rounded-full hover:bg-[#ffe6e9] transition cursor-pointer"
            >
              <Search size={18} />
            </Button>
          )}

          <Button
            onClick={handleCalendar}
            className="bg-white text-[#d64553] p-2 rounded-full hover:bg-[#ffe6e9] transition cursor-pointer"
          >
            <Calendar size={18} />
          </Button>

          {/* 🔹 Profile Button */}
          <Button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-gray-700 transition overflow-hidden"
          >
            {user?.profile_image ? (
              <img
                src={
                  user.profile_image.startsWith("http")
                    ? user.profile_image
                    : `${window.API_BASE}${user.profile_image}`
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            ) : (
              user?.lastname?.charAt(0)?.toUpperCase() || "M"
            )}
          </Button>

          {/* 🔹 Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white text-gray-800 shadow-lg rounded-xl w-40 py-2 z-50">
              <p className="px-4 py-2 text-sm border-b">
                Logged in as:{" "}
                <span className="font-semibold">{user?.lastname || "Guest"}</span>
              </p>
              <Button
                onClick={handleProfile}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 transition"
              >
                <UserRound size={16} /> Profile
              </Button>
              <Button
                onClick={handleAboutus}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 transition"
              >
                <Contact size={16} /> About Us
              </Button>
              <Button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 transition"
              >
                <LogOut size={16} /> Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* 🔹 Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-6 z-50">
          <div className="bg-white rounded-full flex items-center w-full max-w-md px-4 py-2 shadow-lg animate-slideDown">
            <Search size={18} className="text-gray-500 mr-2" />
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (typeof setSearchQuery === "function") setSearchQuery(e.target.value);
                }}
                placeholder="Search events..."
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base"
              />
            </form>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="ml-3 text-gray-600 hover:text-red-500"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
