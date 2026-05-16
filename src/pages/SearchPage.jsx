import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import FiltersSidebar from "../components/common/FiltersSidebar";
import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext";

// --------------------------------------------------
// DATE FORMATTER
// --------------------------------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

export default function SearchPage() {
  const [items, setItems] = useState([]); // merged events + announcements
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [announcementModal, setAnnouncementModal] = useState(null); // active announcement
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --------------------------------------------------
  // FETCH EVENTS + ANNOUNCEMENTS
  // --------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Events
        const eventRes = await fetch(window.API_BASE + "/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const events = await eventRes.json();

        const eventList = events.map((e) => ({
          ...e,
          source: "event",
          displayDate: e.event_date,
          formattedDate: formatDate(e.event_date),
          type: e.type || "Event",
        }));

        // Fetch Approved Announcements
        const annRes = await fetch(
          window.API_BASE + "/api/announcements/approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const announcements = await annRes.json();

        const annList = announcements.map((a) => ({
          ...a,
          source: "announcement",
          displayDate: a.created_at,
          formattedDate: formatDate(a.created_at),
          title: a.title,
          description: a.description,
          category: "Announcement",
          type: "Announcement",
          status: "Approved",
        }));

        const merged = [...eventList, ...annList];

        setItems(merged);
        setFilteredItems(merged);
      } catch (err) {
        showError("Failed to load events and announcements");
      }
    };

    loadData();
  }, [token]);

  // --------------------------------------------------
  // FILTER + SEARCH FUNCTION
  // --------------------------------------------------
  useEffect(() => {
    let filtered = [...items];

    if (filters.type?.length) {
      filtered = filtered.filter((i) => filters.type.includes(i.type));
    }
    if (filters.category?.length) {
      filtered = filtered.filter((i) => filters.category.includes(i.category));
    }
    if (filters.department?.length) {
      filtered = filtered.filter((i) =>
        filters.department.includes(i.department)
      );
    }
    if (filters.status?.length) {
      filtered = filtered.filter((i) => filters.status.includes(i.status));
    }

    if (filters.dateRange && filters.dateRange !== "All Dates") {
      const today = new Date();
      filtered = filtered.filter((item) => {
        const date = new Date(item.displayDate);

        if (filters.dateRange === "Today")
          return date.toDateString() === today.toDateString();

        if (filters.dateRange === "This Week") {
          const start = new Date(today);
          start.setDate(start.getDate() - start.getDay());
          const end = new Date(start);
          end.setDate(end.getDate() + 7);
          return date >= start && date <= end;
        }

        if (filters.dateRange === "This Month") {
          return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
        }

        return true;
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [filters, searchQuery, items]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleClearAll = () => {
    setFilters({
      type: [],
      category: [],
      dateRange: "All Dates",
      department: [],
      status: [],
    });
    setFilteredItems(items);
  };

  // --------------------------------------------------
  // UI COMPONENT
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <Navbar showSearchBar={true} setSearchQuery={setSearchQuery} />

      <main
        className={`flex p-6 gap-6 transition-all duration-300 ${
          isFilterOpen || announcementModal
            ? "blur-sm pointer-events-none md:pointer-events-auto"
            : ""
        }`}
      >
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FiltersSidebar
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="fixed bottom-6 right-6 z-30 md:hidden bg-red-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-600 transition"
        >
          Show Filters
        </button>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Search Results for “{searchQuery}”
            </h1>
            <p className="text-sm text-gray-500">
              {filteredItems.length} result
              {filteredItems.length !== 1 && "s"} found
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No results found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                // Use unique keys for events and announcements
                const itemKey =
                  item.source === "announcement"
                    ? `announcement-${item.announcement_id}`
                    : `event-${item.event_id}`;

                return (
                  <div
                    key={itemKey}
                    className="border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-150"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </h2>

                      {item.source === "event" ? (
                        <button
                          onClick={() => navigate(`/events/${item.event_id}`)}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1 rounded-lg text-sm"
                        >
                          View Details
                        </button>
                      ) : (
                        <button
                          onClick={() => setAnnouncementModal(item)}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1 rounded-lg text-sm"
                        >
                          View Details
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md">
                        {item.type}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {item.category}
                      </span>
                      {item.organizer_name && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md">
                          {item.organizer_name}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>

                    <div className="text-xs text-gray-400 mt-2">
                      📅 {item.formattedDate} | Status: {item.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {isFilterOpen && (
        <>
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          ></div>

          <div
            className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-30 transform transition-transform duration-300 md:hidden ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-full">
              <FiltersSidebar
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            </div>
          </div>
        </>
      )}

      {/* Announcement Modal */}
      {announcementModal && (
        <>
          <div
            onClick={() => setAnnouncementModal(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          ></div>

          <div className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {announcementModal.title}
              </h2>
              <button
                onClick={() => setAnnouncementModal(null)}
                className="text-gray-500 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-400 mb-2">
              📅 {announcementModal.formattedDate} | Status:{" "}
              {announcementModal.status}
            </div>

            <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-600">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md">
                {announcementModal.type}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-md">
                {announcementModal.category}
              </span>
            </div>

            <p className="text-gray-600">{announcementModal.description}</p>
          </div>
        </>
      )}
    </div>
  );
}
