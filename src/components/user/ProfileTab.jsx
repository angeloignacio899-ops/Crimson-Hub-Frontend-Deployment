import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";

export default function ProfileTab() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showError } = useError();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);

        if (!token) {
          console.warn("No token found, redirecting to login...");
          setError("You must be logged in.");
          setLoading(false);
          navigate("/login"); // redirect to login page
          return;
        }

        const res = await axios.get(window.API_BASE + "/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User data fetched:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err.response || err.message);

        if (err.response) {
          if (err.response.status === 401) {
            showError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
          } else if (err.response.status === 404) {
            showError("User not found.");
          } else {
            setError("An error occurred while fetching your data.");
          }
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">
          No user data found. Please check your account or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Personal Information
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={user.firstname || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={user.lastname || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Birthday
          </label>
          <input
            type="text"
            value={user.birthday || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Gender
          </label>
          <input
            type="text"
            value={user.gender || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user.email || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Student ID
          </label>
          <input
            type="text"
            value={user.student_id || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Department
          </label>
          <input
            type="text"
            value={user.department || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Year Level
          </label>
          <input
            type="text"
            value={user.year_level || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course
          </label>
          <input
            type="text"
            value={user.course || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={user.phone || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
}
