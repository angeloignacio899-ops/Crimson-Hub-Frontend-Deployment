import React, { useState, useEffect } from "react";

const FiltersSidebar = ({ onClearAll, onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: [],
    category: [],
    status: [],
  });

  // Handle checkbox selection
  const handleCheckboxChange = (section, value) => {
    setFilters((prev) => {
      const current = prev[section];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters]);


  const handleClear = () => {
    const cleared = {
      type: [],
      category: [],
      status: [],
    };
    setFilters(cleared);
    onClearAll?.(cleared);
  };

  return (
    <div className="w-64 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-700">Filters</h2>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Type Section */}
      <Section title="Type">
        {["Event", "Announcement"].map((type) => (
          <Checkbox
            key={type}
            label={type}
            checked={filters.type.includes(type)}
            onChange={() => handleCheckboxChange("type", type)}
          />
        ))}
      </Section>

      {/* Category Section */}
      <Section title="Category">
        {["Academic", "Non-Academic"].map((cat) => (
          <Checkbox
            key={cat}
            label={cat}
            checked={filters.category.includes(cat)}
            onChange={() => handleCheckboxChange("category", cat)}
          />
        ))}
      </Section>

      {/* Status Section */}
      <Section title="Status">
        {["Upcoming", "Ongoing"].map((status) => (
          <Checkbox
            key={status}
            label={status}
            checked={filters.status.includes(status)}
            onChange={() => handleCheckboxChange("status", status)}
          />
        ))}
      </Section>
    </div>
  );
};

// ---------------------
// Sub-components
// ---------------------
const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span>{label}</span>
  </label>
);

export default FiltersSidebar;
