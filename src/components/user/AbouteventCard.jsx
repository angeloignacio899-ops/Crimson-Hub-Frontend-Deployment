import React from "react";

export default function AboutEventCard({ event }) {

  // If event is not loaded yet
  if (!event) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200 gap-3">
      
      {/* Event Title */}
      <h2 className="text-gray-900 text-xl font-bold border-b border-gray-200 pb-3 mb-5">
        About the Event
      </h2>

      {/* Event Description */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {event.description || "No description available."}
      </p>

      {/* Optional: Expectations if your backend provides it */}
      {event.expectations && event.expectations.length > 0 && (
        <>
          <h3 className="text-gray-900 font-semibold mt-8 mb-3">
            {event.expectationsTitle || "What to Expect"}
          </h3>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {event.expectations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {/* Optional Footer */}
      {event.footer && (
        <p className="text-gray-700 mt-8 leading-relaxed italic">
          {event.footer}
        </p>
      )}
    </div>
  );
}
