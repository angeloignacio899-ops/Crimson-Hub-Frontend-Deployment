import React, { useState, useEffect } from "react";
import PendingTableRow from "./PendingTableRow";
import PendingFilters from "./PendingFilters";
import EventDetailModal from "./EventDetailModal";
import AnnouncementDetailModal from "./AnnouncementDetailModal";

const PendingTable = () => {
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch pending items from backend
  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(window.API_BASE + "/api/pending/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch pending items");
        }

        const data = await res.json();
        setItems(data.items);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingItems();
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "All" ? true : item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.organizer?.toLowerCase() || "").includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <PendingFilters
        filterType={filterType}
        setFilterType={setFilterType}
        search={search}
        setSearch={setSearch}
      />

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-4 text-left text-sm font-bold">Title</th>
              <th className="p-4 text-left text-sm font-bold">Type</th>
              <th className="p-4 text-left text-sm font-bold">Category</th>
              <th className="p-4 text-left text-sm font-bold">Organizer</th>
              <th className="p-4 text-left text-sm font-bold hidden sm:table-cell">Created At</th>
              <th className="p-4 text-left text-sm font-bold">Status</th>
              <th className="p-4 text-center text-sm font-bold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <PendingTableRow key={item.id} item={item} onView={setSelectedItem} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditional Modals */}
      {selectedItem && selectedItem.type === "Event" && (
        <EventDetailModal event={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {selectedItem && selectedItem.type === "Announcement" && (
        <AnnouncementDetailModal announcement={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default PendingTable;
