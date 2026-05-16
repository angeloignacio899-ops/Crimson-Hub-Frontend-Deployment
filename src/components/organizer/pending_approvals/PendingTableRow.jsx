import React from "react";
import { Eye } from "lucide-react";

const statusBadge = {
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const PendingTableRow = ({ item, onView }) => (
  <tr className="border-b hover:bg-red-50 transition-colors">
    <td className="p-4 font-medium">{item.title}</td>
    <td className="p-4 text-gray-600 text-sm">{item.type}</td>
    <td className="p-4 text-gray-600 text-sm">{item.category}</td>
    <td className="p-4 text-gray-600 text-sm">{item.organizer}</td>
    <td className="p-4 text-gray-600 text-sm hidden sm:table-cell">
      {formatDate(item.createdAt)}
    </td>
    <td className="p-4">
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge[item.status]}`}>
        {item.status}
      </span>
    </td>
    <td className="p-4 text-center">
      <button
        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition"
        onClick={() => onView(item)}
      >
        <Eye size={18} />
      </button>
    </td>
  </tr>
);

export default PendingTableRow;
