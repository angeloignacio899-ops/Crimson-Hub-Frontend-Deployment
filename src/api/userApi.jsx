import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL || window.API_BASE + ""; // base server URL
const BASE_URL = `${SERVER_URL}/api/user`;

// ✅ Create an Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust if your token is stored differently
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Map role_id to readable role
const getRoleName = (role_id) => {
  switch (role_id) {
    case 1:
      return "Student";
    case 2:
      return "Organizer";
    case 3:
      return "Admin";
    default:
      return "Unknown";
  }
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const res = await api.get("/");

    if (Array.isArray(res.data)) {
      return res.data.map((user) => ({
        ...user,
        role: getRoleName(user.role_id),
        profile_image: user.profile_image
          ? `${SERVER_URL}${user.profile_image}`
          : null,
      }));
    }

    return [];
  } catch (error) {
    // Silently fail and return empty array to prevent app crash
    return [];
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/${id}`);
    return res.data.success === true;
  } catch (err) {
    // Return false on error without console logging
    return false;
  }
};

// Update user
export const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};
