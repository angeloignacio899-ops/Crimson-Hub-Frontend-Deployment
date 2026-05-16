import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchWithAuth } from "../../../utils/fetchWithAuth.js";

const EventFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchWithAuth(window.API_BASE + "/api/categories");
        const data = await res.json();

        // Your backend returns ARRAY directly
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* 🔍 Search */}
      <div className="relative flex-grow">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search events or organizer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-gray-700"
        />
      </div>

      {/* 📂 Dynamic Category Dropdown */}
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="flex-shrink-0 bg-white border border-gray-300 px-4 py-3 rounded-xl text-gray-700 text-sm font-medium"
      >
        {/* Default */}
        <option value="all">All</option>

        {/* From DB */}
        {categories.map((cat) => (
          <option
            key={cat.category_id}
            value={cat.category_name.toLowerCase()}
          >
            {cat.category_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventFilters;