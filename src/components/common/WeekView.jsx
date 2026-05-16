import React from "react";
import { Clock, MapPin } from "lucide-react";

export default function WeekView ({ filteredEvents, setSelectedEvent }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Week View - Nov 3-9, 2025 </h2>
      <div className="space-y-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
          const dayNum = idx + 3;
          const dayEvents = filteredEvents.filter(e => {
            const eventDay = new Date(e.date).getDate();
            return eventDay === dayNum;
          });

          return (
            <div key={day} className="border-b-2 border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{day}, November {dayNum}</h3>
              {dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg cursor-pointer hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{event.title}</p>
                          <div className="flex gap-4 text-sm text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> {event.location}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.category_name === 'Academic'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                            {event.category_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No events scheduled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}