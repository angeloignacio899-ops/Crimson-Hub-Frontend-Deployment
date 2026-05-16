import { useState, useEffect } from "react";
import Button from "./Button";
import AnnouncementCard from "./AnnouncementCard";

export default function LatestUpdates() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortStatus, setSortStatus] = useState("All");

  const categories = [
    "All",
    "Academic",
    "Non-Academic",
  ];

  const statuses = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(window.API_BASE + "/api/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        // Filter only approved events
        const approvedEvents = data.filter(
          (event) => event.approval_status.toLowerCase() === "approved"
        );

        // Sort newest first (by created_at)
        approvedEvents.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        // Take only 3 most recent
        setAnnouncements(approvedEvents.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  let filteredAnnouncements =
    activeCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category_name === activeCategory);

  if (sortStatus !== "All") {
    filteredAnnouncements = filteredAnnouncements.filter(
      (a) => a.status.toLowerCase() === sortStatus.toLowerCase()
    );
  }

  return (
    <div className="py-4 px-6">
      {/* Category & Status Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const styles = isActive
              ? "bg-[#a22c36] text-white border-[#a22c36]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200";

            return (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1 rounded-full text-sm font-medium border transition-all cursor-pointer ${styles}`}
              >
                {category}
              </Button>
            );
          })}
        </div>

        <div>
          <select
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#a22c36] cursor-pointer"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                Sort by: {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Event Cards */}
      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading events...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((event) => (
              <AnnouncementCard
                key={event.event_id}
                id={event.event_id}
                category={event.category_name || event.category}
                color={event.color || "bg-gray-300"}
                title={event.title}
                desc={event.description || "No description available"}
                tags={event.tags || []}
                created_at={event.created_at || "No time available"}
                date={event.event_date || "No date available"}
                status={event.status}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No events found for this filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
