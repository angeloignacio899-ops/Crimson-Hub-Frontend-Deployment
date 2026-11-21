import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import axios from "axios";
import { useError } from "../../context/ErrorContext";

const getDateKey = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (typeof value !== "string") return null;
  return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || null;
};

const getEventStatus = (event) => {
  const startDate = getDateKey(event.start_date) || getDateKey(event.date);
  const endDate = getDateKey(event.end_date) || startDate;

  if (!startDate || !endDate) return "Unknown";

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (todayKey < startDate) return "Upcoming";
  if (todayKey > endDate) return "Ended";
  return "Ongoing";
};

const EVENT_STATUS_STYLES = {
  Upcoming: "bg-green-100 text-green-700",
  Ongoing: "bg-yellow-100 text-yellow-700",
  Ended: "bg-red-100 text-red-700",
  Unknown: "bg-gray-100 text-gray-600",
};
const EVENTS_PER_PAGE = 5;

const getHiddenEventIds = (storageKey) => {
  const storedIds = localStorage.getItem(storageKey);
  if (!storedIds) return [];

  const parsedIds = JSON.parse(storedIds);
  return Array.isArray(parsedIds) ? parsedIds.map(String) : [];
};

export default function RegisteredTab({ userId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRemoving, setIsRemoving] = useState(false);
  const { showError } = useError();
  const hiddenEventsStorageKey = `hiddenJoinedEventIds:${userId}`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(window.API_BASE + "/api/events/joined", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hiddenIdSet = new Set(getHiddenEventIds(hiddenEventsStorageKey));
        setEvents(res.data.filter((event) => !hiddenIdSet.has(String(event.event_id))));
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to fetch registered events.";
        setError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [hiddenEventsStorageKey, showError]);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const visibleEvents = events.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const toggleEventSelection = (eventId) => {
    setSelectedEventIds((selectedIds) =>
      selectedIds.includes(eventId)
        ? selectedIds.filter((selectedId) => selectedId !== eventId)
        : [...selectedIds, eventId]
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedEventIds.length === 0 || isRemoving) return;

    try {
      setIsRemoving(true);
      const selectedIds = new Set(selectedEventIds);
      const hiddenIds = getHiddenEventIds(hiddenEventsStorageKey);
      const allHiddenIds = new Set([...hiddenIds, ...selectedEventIds.map(String)]);
      localStorage.setItem(hiddenEventsStorageKey, JSON.stringify([...allHiddenIds]));
      setEvents((currentEvents) =>
        currentEvents.filter((event) => !selectedIds.has(event.event_id))
      );
      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(1, Math.ceil((events.length - selectedEventIds.length) / EVENTS_PER_PAGE))
        )
      );
      setSelectedEventIds([]);
      setSelectionMode(false);
    } catch (err) {
      console.error("Failed to hide selected joined events:", err);
      showError("Failed to hide selected events on this device.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading registered events...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 mb-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Joined Events ({events.length})
        </h2>
        {selectionMode ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRemoveSelected}
              disabled={selectedEventIds.length === 0 || isRemoving}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              {isRemoving ? "Removing..." : `Remove selected (${selectedEventIds.length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectionMode(false);
                setSelectedEventIds([]);
              }}
              disabled={isRemoving}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSelectionMode(true)}
            disabled={events.length === 0}
            aria-label="Select joined events to remove"
            title="Select joined events to remove"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Select to remove
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">You haven't joined any events yet.</p>
      ) : (
        <div className="space-y-4">
          {visibleEvents.map((event) => {
            const status = getEventStatus(event);

            return (
              <div
                key={event.event_id}
                className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  {selectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedEventIds.includes(event.event_id)}
                      onChange={() => toggleEventSelection(event.event_id)}
                      aria-label={`Select ${event.title}`}
                      className="h-4 w-4 accent-red-600"
                    />
                  )}
                  <div className="bg-red-100 p-3 rounded-full">
                    <Calendar className="text-red-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-md text-sm font-medium ${EVENT_STATUS_STYLES[status]}`}>
                  {status}
                </span>
              </div>
            );
          })}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
