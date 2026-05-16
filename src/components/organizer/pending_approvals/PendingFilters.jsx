// components/PendingFilters.jsx
import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

const PendingFilters = ({ filterType, setFilterType, search, setSearch }) => {
  const [open, setOpen] = useState(false); // controls dropdown

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
      {/* Search Bar */}
      <div className="relative flex-grow">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or organizer..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-gray-700"
        />
      </div>

      {/* Type Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 text-sm font-medium"
        >
          {filterType === "All" ? "All Types" : filterType}
          <ChevronDown size={16} className="ml-2" />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded-xl overflow-hidden w-40 z-50 border border-gray-200">
            <button
              onClick={() => {
                setFilterType("All");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              All
            </button>

            <button
              onClick={() => {
                setFilterType("Event");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Event
            </button>

            <button
              onClick={() => {
                setFilterType("Announcement");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Announcement
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default PendingFilters;
