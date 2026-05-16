import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function CalendarCard() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">
          {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
        </h3>
        <button 
          className="text-[#d64553] text-sm font-medium hover:underline"
          onClick={() => navigate("/user/calendar")}
        >
          View Calendar
        </button>
      </div>

      {/* Calendar Centered */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Calendar
            onChange={setDate}
            value={date}
            className="react-calendar w-full border-none text-gray-700"
          />
        </div>
      </div>
      
      {/* Custom Tailwind Styling */}
      <style jsx global>{`
        .react-calendar {
          border-radius: 1rem;
          font-family: 'Inter', sans-serif;
        }
        .react-calendar__navigation button {
          color: #d64553;
          font-weight: 500;
          min-width: 44px;
          background: transparent;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #fde8e8;
          border-radius: 0.5rem;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 500;
          font-size: 0.75rem;
          color: #9ca3af;
        }
        .react-calendar__tile {
          border-radius: 0.5rem;
          height: 3rem;
          line-height: 3rem;
          transition: all 0.2s;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #fde8e8;
          color: #d64553;
        }
        .react-calendar__tile--now {
          background: #d64553;
          color: white;
          font-weight: 600;
        }
        .react-calendar__tile--active {
          background: #fcd5d5;
          color: #d64553;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}
