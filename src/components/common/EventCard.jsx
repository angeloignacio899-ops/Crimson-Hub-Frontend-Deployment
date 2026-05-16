import { Calendar, Clock, MapPin, Users } from "lucide-react";

export default function EventCard({ item }) {
  const isEvent = item.type.toLowerCase() === "events";
  const match = Math.floor(Math.random() * 26) + 70; // 70–95% for demo

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm hover:shadow-md transition">
      <div className="absolute top-3 right-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
        {match}% Match
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md text-white ${item.color}`}
        >
          {item.type.toUpperCase()}
        </span>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-700">
          {item.category}
        </span>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-700">
          {item.status}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        {item.title}
      </h2>
      <p className="text-sm text-gray-600 mb-3">{item.desc}</p>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} /> {item.date}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} /> {item.time}
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={16} /> {item.department}
        </div>
        {item.tags?.length > 0 && (
          <div className="flex items-center gap-1">
            <Users size={16} /> {item.tags.join(", ")}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button className="border border-blue-500 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
          View Details
        </button>
        {isEvent && (
          <button className="bg-[#a22c36] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#8c1f29] transition">
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}
