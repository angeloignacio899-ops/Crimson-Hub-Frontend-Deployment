import React from "react";

export default function UpcomingEvents ({ filteredEvents, setSelectedEvent}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
            <div className="space-y-3">
                {filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5).map(event =>(
                    <div key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-50 to-white rounded-lg border border-pink-200 hover:shadow-md transition cursor-pointer"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.date} at {event.time} • {event.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.category === 'Academic'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                            {event.category}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}