import React from "react";
import {ChevronLeft, ChevronRight } from "lucide-react";

export default function HeaderControls ({ getMonthYear, previousMonth, nextMonth, setViewMode, viewMode}) {
    return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center flex-wrap gap-5 mb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h2 className="text-2xl font-bold text-slate-700 min-w-48 text-center">{getMonthYear()}</h2>
          <button 
            onClick={nextMonth}
            className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>

        
      </div>
    </div>
  )
}