import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetch("/data/data.json") 
      .then((res) => res.json())
      .then((data) => {
        const upcomingEvents = data
          .filter((e) => e.status === "Upcoming")
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(upcomingEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#d64553] hover:underline font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading events...</p>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="bg-[#d64553]/10 text-[#d64553] w-14 h-14 flex flex-col items-center justify-center rounded-lg font-bold">
                  <span className="text-lg">{new Date(event.date).getDate()}</span>
                  <span className="text-xs uppercase">
                    {new Date(event.date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> {event.time}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={14} /> {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No upcoming events found.
          </p>
        )}
      </div>
    </div>
  );
}
