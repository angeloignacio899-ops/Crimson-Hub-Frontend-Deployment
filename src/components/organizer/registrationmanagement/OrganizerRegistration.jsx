import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, ChevronLeft, Search, Filter, ChevronDown } from 'lucide-react';

const OrganizerRegistrationPage = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  // Fetch organizer's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(window.API_BASE + '/api/events/organizer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Fetch attendees when an event is selected
  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setLoadingAttendees(true);
    try {
      const res = await axios.get(`${window.API_BASE}/api/events/attendees/${event.event_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendees(res.data);
    } catch (err) {
      console.error(err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredEvents = events.filter(
    e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (e.category_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-2xl border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedEvent ? "Event Attendees" : "My Events"}
        </h1>
      </header>

      <main className="p-4 flex-1">
        {!selectedEvent && (
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-grow max-w-md w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                placeholder="Search events or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
                <Filter size={16}/> Status
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
                All Categories <ChevronDown size={16}/>
              </button>
            </div>
          </div>
        )}

        {!selectedEvent ? (
          <div className="bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left hidden sm:table-cell">Category</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingEvents ? (
                  <tr><td colSpan="3" className="p-8 text-center">Loading events...</td></tr>
                ) : filteredEvents.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center">No events found.</td></tr>
                ) : filteredEvents.map(event => (
                  <tr key={event.event_id} className="hover:bg-red-50 cursor-pointer" onClick={() => handleSelectEvent(event)}>
                    <td className="p-4">{event.title}</td>
                    <td className="p-4 hidden sm:table-cell">{event.category_name}</td>
                    <td className="p-4 text-center"><Eye size={18} className="text-gray-400 hover:text-red-600 mx-auto"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <button className="flex items-center text-red-600 font-semibold mb-6" onClick={() => setSelectedEvent(null)}>
              <ChevronLeft size={20} className="mr-2"/> Back
            </button>

            <h2 className="text-2xl font-bold mb-1">{selectedEvent.title} Attendees</h2>
            {loadingAttendees ? (
              <p>Loading attendees...</p>
            ) : attendees.length === 0 ? (
              <p className="text-gray-500 italic">No attendees registered yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-200">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">First Name</th>
                    <th className="p-4 text-left">Last Name</th>
                    <th className="p-4 text-left">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map(att => (
                    <tr key={att.user_id} className="hover:bg-gray-50">
                      <td className="p-4">{att.firstname}</td>
                      <td className="p-4">{att.lastname}</td>
                      <td className="p-4 text-blue-600">{att.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerRegistrationPage;
