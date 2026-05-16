import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import { useError } from "../../context/ErrorContext";

export default function RegisteredTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showError } = useError();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(window.API_BASE + "/api/events/joined", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data);
      } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch registered events.";
        setError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-8">Loading registered events...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Joined Events ({events.length})
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">You haven't joined any events yet.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Calendar className="text-red-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                </div>
              </div>

              <span className="bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-medium">
                Upcoming
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
