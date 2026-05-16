// components/DashboardCalendar.jsx
import React, { useState } from "react";

const DashboardCalendar = ({ events = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();

  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

  const startDay = startOfMonth.getDay(); // 0-6, Sunday-Saturday
  const daysInMonth = endOfMonth.getDate();

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null); // empty slots
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));

  // Helper: check if date has events
  const hasEvents = (date) =>
    events.some(e => new Date(e.date).toDateString() === date.toDateString());

  // Helper: change month
  const changeMonth = (offset) => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
    setSelectedDate(newMonth);
  };

  // Filter events for selected date
  const eventsForDate = events.filter(e =>
    new Date(e.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="text-gray-500 hover:text-gray-800"
        >
          {"<"}
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="text-gray-500 hover:text-gray-800"
        >
          {">"}
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-gray-500 text-sm mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((date, idx) =>
          date ? (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`
                relative py-2 rounded-lg
                ${date.toDateString() === today.toDateString() ? "border border-red-500" : ""}
                ${date.toDateString() === selectedDate.toDateString() ? "bg-red-500 text-white" : "hover:bg-red-100"}
              `}
            >
              {date.getDate()}
              {hasEvents(date) && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
          ) : (
            <div key={idx}></div>
          )
        )}
      </div>

      {/* Events for selected date */}
      {eventsForDate.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Events/Announcements:</h3>
          <ul className="space-y-1">
            {eventsForDate.map(e => (
              <li key={e.id} className="px-2 py-1 bg-red-50 text-red-800 rounded">
                {e.title} ({e.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
