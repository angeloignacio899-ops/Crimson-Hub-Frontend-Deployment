// notificationApi.js
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || window.API_BASE + ""}/api`
});

// Fetch all notifications
export const fetchNotifications = async () => {
  const token = localStorage.getItem("jwt"); // make sure the token is stored here
  if (!token) throw new Error("No token found");

  const { data } = await API.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

// Fetch details of one notification
export const fetchNotificationDetails = async (id) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const { data } = await API.get(`/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Delete notification
export const deleteNotification = async (id) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const { data } = await API.delete(`/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
