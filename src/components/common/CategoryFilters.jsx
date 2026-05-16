import React from "react";

export default function CategoryFilters ({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex gap-3 flex-wrap">
        <span className="text-sm font-semibold text-gray-500 self-center">
          Filters:
        </span>
        {categories.map((cat) => (
          <button key={cat.key}
          onClick={() => setSelectedCategory(cat.key)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
            selectedCategory === cat.key
            ? `${cat.color} text-white`
            : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
          }`}
          >
            {cat.label}
          </button>
        ))}

      </div>

    </div>
  )
}