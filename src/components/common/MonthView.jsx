import React from "react";

export default function MonthView({
  days,
  getEventsForDay,
  onDayClick,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 py-3 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const dayEvents = day ? getEventsForDay(day) : [];

          return (
            <div
              key={idx}
              className={`min-h-32 p-3 rounded-lg border-2 transition cursor-pointer ${
                day
                  ? "bg-white border-gray-300 hover:bg-gray-100"
                  : "bg-gray-50 border-gray-200"
              }`}
              onClick={() => day && dayEvents.length > 0 && onDayClick(dayEvents)}
            >
              {day && (
                <>
                  <div className="font-bold text-lg text-gray-800 mb-2">
                    {day}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.event_id || event.id}
                        className={`text-xs p-2 rounded cursor-pointer hover:shadow-md transition font-semibold truncate ${
                          event.category_name === "Academic"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        + {dayEvents.length - 2} more...
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
