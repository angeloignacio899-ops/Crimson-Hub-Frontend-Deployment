import Navbar from "../components/common/Navbar";
import { UserPen } from "lucide-react";
import Button from "../components/common/Button";
import ProfileTab from "../components/user/ProfileTab";
import RegisteredTab from "../components/user/RegisteredTab";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useError } from "../context/ErrorContext";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { showError } = useError();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(window.API_BASE + "/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        showError("Failed to load user profile");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading user data...
      </div>
    );
  }

  // ✅ Safely format date (handles MySQL datetime format)
  const formattedDate = user.created_at
    ? new Date(user.created_at.replace(" ", "T")).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto mt-10 pb-10">
          {/* Profile Header */}
          <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-sm px-8 py-6">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                {user.profile_image ? (
                  <img
                    src={
                  user.profile_image.startsWith("http")
                    ? user.profile_image
                    : `${window.API_BASE}${user.profile_image}`
                }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-red-800">
                    {user.firstname?.[0] || "U"}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.lastname}, {user.firstname}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {user.student_id} • {user.year_level} Year • {user.course}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {formattedDate}
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/user/editProfile")}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition"
            >
              <UserPen size={16} /> Edit Profile
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex justify-evenly items-center bg-white border border-gray-200 rounded-xl shadow-md px-8 py-6 mt-8">
            <Button
              label="Profile Information"
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "info"
                  ? "bg-red-700 text-white shadow-md scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            />

            <Button
              label="Joined Events"
              onClick={() => setActiveTab("joined")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "joined"
                  ? "bg-red-700 text-white shadow-md scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            />
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "info" && <ProfileTab user={user} />}
            {activeTab === "joined" && <RegisteredTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
