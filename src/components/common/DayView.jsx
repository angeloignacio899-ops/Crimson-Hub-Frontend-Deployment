import React from "react";
import { Clock, MapPin, User } from "lucide-react";

export default function DayView ({getEventsForDay, setSelectedEvent}) {
    const events = getEventsForDay(5);

    return (
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Day View - November 5, 2025</h2>
            <div className="space-y-3">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-bold text-2xl text-gray-800 mb-3">{event.title}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock size={18} className="text-red-500" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin size={18} className="text-red-500" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User size={18} className="text-red-500" />
                                            <span>{event.organizer}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-semibold">{event.attendees} attendees</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-4">{event.description}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    event.category_name === 'Academic'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                    {event.category_name}

                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center py-8">No events scheduled for this day.</p>
                )}
            </div>
        </div>
    );
}