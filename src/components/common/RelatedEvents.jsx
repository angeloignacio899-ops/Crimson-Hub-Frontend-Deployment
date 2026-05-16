import React from "react";
import { CalendarDays, BriefcaseBusiness } from "lucide-react";

export default function RelatedEvents() {
  const events = [
    {
      title: "Tech Summit 2025",
      date: "Nov 15",
      category: "Academic",
      icon: <CalendarDays className="w-5 h-5 text-white" />,
      color: "bg-pink-400",
    },
    {
      title: "Career Fair",
      date: "Oct 21",
      category: "Organization",
      icon: <BriefcaseBusiness className="w-5 h-5 text-white" />,
      color: "bg-green-400",
    },
  ];

  return (
    <div className="bg-white w-full p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Related Events
      </h2>

      <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
        {events.map((e, i) => (
          <div
            key={i}
            className="flex items-center p-3 sm:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition duration-200"
          >
            <div
              className={`w-10 h-10 ${e.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
            >
              {e.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm sm:text-base">
                {e.title}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                {e.date} &bull; {e.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
