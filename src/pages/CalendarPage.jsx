import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import HeaderControls from "../components/common/HeaderControls";
import MonthView from "../components/common/MonthView";
import UpcomingEvents from "../components/common/UpcomingEvents";
import EventModal from "../components/common/EventModal";
import { useError } from "../context/ErrorContext";

export default function CalendarView() {
  const navigate = useNavigate();
  const { showError } = useError();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved events
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(window.API_BASE + "/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("EVENT DATA:", data);
        if (!Array.isArray(data)) return;
        const approvedEvents = data.filter(
          (e) => e.approval_status?.toLowerCase() === "approved"
        );
        setEvents(approvedEvents);
        setLoading(false);
      })
      .catch((err) => {
        showError("Failed to load events");
        setLoading(false);
      });
  }, []);

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // Helpers
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= getDaysInMonth(currentDate); i++) days.push(i);

  // Pure: returns events only
  const getEventsForDay = (day) => {
  if (!day) return [];

  return filteredEvents.filter((e) => {
    const eventDate = new Date(e.event_date); 

    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    );
  });
};


  const getMonthYear = () =>
    currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  // Handle day click for modal
  const handleDayClick = (dayEvents) => {
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
    } else if (dayEvents.length > 1) {
      setSelectedDayEvents(dayEvents);
      setSelectedEvent({ multiple: true }); // Signal modal
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-10 space-y-6">

        {/* Month Header */}
        <HeaderControls
          getMonthYear={getMonthYear}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
          viewMode={"month"}
          setViewMode={() => {}}
        />

        {/* Category Filters */}
        <div className="flex bg-white p-4 rounded-xl shadow-md gap-2 mb-4">
          {["all", "Academic", "Non-Academic"].map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded ${
                selectedCategory === cat
                  ? cat === "Academic"
                    ? "bg-blue-600"
                    : cat === "Non-Academic"
                    ? "bg-red-600"
                    : "bg-gray-700"
                  : "bg-gray-600"
              } text-white`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Month View */}
        <MonthView
          days={days}
          getEventsForDay={getEventsForDay}
          onDayClick={handleDayClick}
        />

        {/* Upcoming Events */}
        <UpcomingEvents
          filteredEvents={events
            .filter((e) => e.approval_status?.toLowerCase() === "approved")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)}
          setSelectedEvent={setSelectedEvent}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        dayEvents={selectedDayEvents}
      />
    </div>
  );
}
