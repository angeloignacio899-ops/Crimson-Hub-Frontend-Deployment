import React from "react";

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 font-bold text-lg"
        >
          ✕
        </button>

        {event.event_image && (
          <div className="mt-4">
            <img
              src={`${window.API_BASE}/uploads/events/${event.event_image}`}
              alt={event.title}
              className="rounded-lg max-h-60 w-full object-cover"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4 mt-4">{event.title}</h2>
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Organizer:</strong> {event.organizer}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Date:</strong> {event.event_date}</p>
        <p><strong>Time:</strong> {event.event_time}</p>
        <p><strong>Audience:</strong> {event.audience}</p>
        <p><strong>Number of Registrations:</strong> {event.number_of_registration}</p>
        <p><strong>Event Link:</strong> {event.event_link}</p>
        <p className="mt-2"><strong>Description:</strong> {event.description}</p>


        <p className="mt-4"><strong>Status:</strong> {event.status}</p>
      </div>
    </div>
  );
};

export default EventDetailModal;
