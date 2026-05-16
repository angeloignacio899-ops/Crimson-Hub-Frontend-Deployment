// components/EventTableRow.jsx
import React from "react";
import { Eye } from "lucide-react";

const statusBadge = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const EventTableRow = ({ event, onViewEvent }) => {
  return (
    <tr className="border-b hover:bg-red-50 transition-colors">
      <td className="p-4 font-medium">{event.title}</td>
      <td className="p-4 text-gray-600 text-sm">{event.category_name || event.category || "—"}</td>
      <td className="p-4 text-gray-600 text-sm">{event.organizer_name}</td>

      <td className="p-4 text-gray-600 text-sm hidden sm:table-cell">
        {formatDate(event.created_at)}
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge[event.status]}`}>
          {event.status}
        </span>
      </td>

      <td className="p-4 text-center">
        <button 
          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition"
          onClick={() => onViewEvent(event.event_id)}
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
};

export default EventTableRow;
