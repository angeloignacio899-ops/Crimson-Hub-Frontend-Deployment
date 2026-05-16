import UpcomingEvent from "./UpcomingEvent";
import CalendarCard from "../admin/AdminCalendar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";

export default function Dashboard({ className = "" }) {
  const navigate = useNavigate();
  const { showError } = useError();

  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (timeStr) => {
    if (!timeStr) return "All Day";
    const parts = timeStr.split("–").map((t) => t.trim());
    const formatted = parts
      .map((t) => {
        const [hours, minutes] = t.split(":");
        if (!hours || !minutes) return t;
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
      })
      .join(" – ");
    return formatted;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(window.API_BASE + "/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const upcomingEvents = data
          .filter(
            (e) =>
              e.approval_status?.toLowerCase() === "approved" &&
              e.status?.toLowerCase() === "upcoming"
          )
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
          .slice(0, 5);

        setUpcoming(upcomingEvents);
        setLoading(false);
      })
      .catch((err) => {
        showError("Failed to load upcoming events");
        setLoading(false);
      });
  }, []);

  return (
    <div className={`bg-gray-100 text-gray-800 ${className}`}>
      {/* Use flex to place calendar and events side by side */}
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Calendar */}
        <div className="md:w-1/3">
          <CalendarCard />
        </div>

        {/* Upcoming Events */}
        <div className="md:w-2/3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Upcoming Events</h3>
            <button
              onClick={() => navigate("/events")}
              className="text-[#d64553] text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          <div className="divide-y">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : upcoming.length > 0 ? (
              upcoming.map((event) => (
                <UpcomingEvent
                  key={event.event_id}
                  date={new Date(event.event_date).getDate()}
                  month={new Date(event.event_date).toLocaleString("en-US", {
                    month: "short",
                  })}
                  title={event.title}
                  time={formatTime(event.event_time)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
