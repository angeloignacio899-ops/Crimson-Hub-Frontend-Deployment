// EventTable.jsx
import React from "react";
import EventTableRow from "./EventTableRow";

const EventTable = ({ events = [], onViewEvent }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="p-4 text-left text-sm font-bold">Event Title</th>
            <th className="p-4 text-left text-sm font-bold">Category</th>
            <th className="p-4 text-left text-sm font-bold">Organizer</th>
            <th className="p-4 text-left text-sm font-bold hidden sm:table-cell">Created At</th>
            <th className="p-4 text-left text-sm font-bold">Status</th>
            <th className="p-4 text-center text-sm font-bold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {events.length > 0 ? (
            events.map((event) => (
              <EventTableRow
                key={event.event_id || event.id}
                event={event}
                onViewEvent={onViewEvent}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No events to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
