import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import Button from "./Button";

export default function AnnouncementCard({

  id,
  category,
  color,
  title,
  desc,
  tags = [],
  created_at,
  date,
  status,
}) {
  const navigate = useNavigate();

  const statusColors = {
    Upcoming: "bg-green-100 text-green-700",
    Ongoing: "bg-yellow-100 text-yellow-700",
    Past: "bg-gray-200 text-gray-600",
    Cancelled: "bg-red-100 text-red-700",
  };

  const categoryColors = {
    "academic": "bg-red-500",
    "non-academic": "bg-blue-500",
  };

  const dotColors = {
    Upcoming: "bg-green-500",
    Ongoing: "bg-yellow-500",
    Past: "bg-gray-400",
    Cancelled: "bg-red-500",
  };

  const handleViewDetails = () => {
    navigate(`/events/${id}`);
  };

  // ------------------------------
  // FORMAT DATE ONLY
  // ------------------------------
  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // ------------------------------
  // FORMAT DATE + TIME
  // ------------------------------
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "No date";

    const isoString = dateTimeStr.replace(" ", "T");
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "Invalid date";

    const formattedDate = date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} • ${formattedTime}`;
  };

  // Determine correct category color
  const categoryColor =
    categoryColors[category?.toLowerCase()] || "bg-gray-300";

  return (
    <div className="bg-white w-full p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">

      {/* Category and Created At */}
      <div className="flex justify-between items-center">
        <span
          className={`${categoryColor} text-white text-xs font-semibold px-3 py-1 rounded-md uppercase`}
        >
          {category}
        </span>

        {/* FIX: Now using formatDateTime() */}
        <span className="text-xs text-gray-400">
          {formatDateTime(created_at)}
        </span>
      </div>

      {/* Title + Description */}
      <div>
        <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {desc || "No description available"}
        </p>
      </div>

      {/* Tags, Event Date, Status */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 border-t border-[#d64553] pt-3">

        {/* Tags */}
        {tags.length > 0 &&
          tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md"
            >
              <Users size={14} /> {tag}
            </span>
          ))}

        {/* Event Date */}
        <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
          <Calendar size={14} /> {formatDate(date)}
        </span>

        {/* Status */}
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              dotColors[status] || "bg-gray-500"
            }`}
          />
          {status}
        </span>
      </div>

      {/* Button */}
      <div className="flex justify-end mt-2">
        <Button
          onClick={handleViewDetails}
          className="bg-[#d64553] hover:bg-[#c43b48] text-white text-sm px-4 py-1.5 rounded-full transition cursor-pointer"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
