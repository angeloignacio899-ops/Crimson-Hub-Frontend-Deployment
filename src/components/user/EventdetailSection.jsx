import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";

// --- DATE FORMATTER ---
const formatDate = (dateStr) => {
  if (!dateStr) return "No date available";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // fallback if backend returns plain text

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// --- TIME FORMATTER ---
const formatTime = (timeStr) => {
  if (!timeStr) return "No time available";

  const date = new Date(`1970-01-01T${timeStr}`);
  if (isNaN(date)) return timeStr; // fallback

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EventDetailsSection({ event }) {
  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200 gap-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h2>

      <ul className="divide-y divide-gray-200">
        {/* CATEGORY */}
        {(event.category_name || event.category) && (
          <li className="flex items-start gap-3 py-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Tag className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Category</p>
              <p className="text-sm text-gray-800">{event.category_name || event.category}</p>
            </div>
          </li>
        )}

        {/* DATE */}
        <li className="flex items-start gap-3 py-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
            <p className="text-sm text-gray-800">
              {formatDate(event.start_date)} - {formatDate(event.end_date)}
            </p>
          </div>
        </li>

        {/* TIME */}
        <li className="flex items-start gap-3 py-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Time</p>
            <p className="text-sm text-gray-800">
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </p>
          </div>
        </li>

        {/* LOCATION */}
        <li className="flex items-start gap-3 py-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Location
            </p>
            <p className="text-sm text-gray-800">{event.location}</p>
          </div>
        </li>

        {/* AUDIENCE */}
        <li className="flex items-start gap-3 py-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Target Audience
            </p>
            <p className="text-sm text-gray-800">{event.audience}</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
