import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventModal({ selectedEvent, setSelectedEvent, dayEvents = [] }) {
  const navigate = useNavigate();

  if (!selectedEvent) return null;

  // Multiple events modal
  if (selectedEvent.multiple) {
    return (
      <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6">
          <h2 className="text-2xl font-bold mb-4">Events on this day</h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dayEvents.map((e) => (
              <div
                key={e.event_id}
                onClick={() => navigate(`/events/${e.event_id}`)}
                className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                <p className="font-semibold text-gray-800">{e.title}</p>
                <p className="text-sm text-gray-600">
                  {e.event_time?.slice(0, 5)} • {e.location || "No location"}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedEvent(null)}
            className="mt-4 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(selectedEvent.event_date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // Single event modal
  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-8">
        <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>

        <p className="text-gray-600 mb-2">
          {formattedDate} at {selectedEvent.event_time?.slice(0, 5)}
        </p>

        <p className="text-gray-600 mb-2">
          Location: {selectedEvent.location || "No location provided"}
        </p>

        <p className="text-gray-600 mb-2">
          Category: {selectedEvent.category || "Uncategorized"}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(`/events/${selectedEvent.event_id}`)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg"
          >
            Details
          </button>

          <button
            onClick={() => setSelectedEvent(null)}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
