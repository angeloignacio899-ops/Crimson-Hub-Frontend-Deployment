import React from 'react';

const StatCard = ({ title, count, color, type, icon: Icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 cursor-pointer flex items-center gap-4 hover:shadow-xl transition`}
    >
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default StatCard;
