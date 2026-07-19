import { Search, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CategoryTag = ({ category }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
    {category || "Uncategorized"}
  </span>
);

const StatusTag = ({ status }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
    {status}
  </span>
);

// ---- View Modal ----
const ViewModal = ({ announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {announcement.title}
        </h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <p><span className="font-medium">Category:</span> {announcement.category_name || announcement.category || "Uncategorized"}</p>
          <p><span className="font-medium">Status:</span> {announcement.status}</p>
          <p><span className="font-medium">Created At:</span> {new Date(announcement.created_at).toLocaleString()}</p>

          <p>
            <span className="font-medium">Description:</span><br />
            <span className="block whitespace-pre-line mt-1">
              {announcement.description}
            </span>
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const AnnouncementRow = ({ announcement, isHighlighted, onView }) => (
  <div
    className={`grid grid-cols-12 gap-4 items-center px-5 py-3 text-sm hover:bg-gray-50 transition
    ${isHighlighted ? "bg-gray-50" : "bg-white"}`}
  >
    <div className="col-span-4 font-medium text-gray-800 truncate">
      {announcement.title}
    </div>

    <div className="col-span-3">
      <CategoryTag category={announcement.category_name || announcement.category} />
    </div>

    <div className="col-span-2 text-gray-600 text-xs">
      {new Date(announcement.created_at).toLocaleDateString()}
    </div>

    <div className="col-span-2 flex justify-center">
      <StatusTag status={announcement.status} />
    </div>

    <div className="col-span-1 flex justify-center">
      <button
        onClick={() => onView(announcement)}
        className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition"
      >
        <Eye size={16} />
      </button>
    </div>
  </div>
);

const AnnouncementManagementContent = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  const [viewAnnouncement, setViewAnnouncement] = useState(null);

  // Fetch approved announcements
  useEffect(() => {
    fetch(window.API_BASE + "/api/announcements/approved")
      .then((res) => res.json())
      .then((data) => {
        const visible = Array.isArray(data)
          ? data.filter((item) => !(item.status && String(item.status).toLowerCase() === "archived"))
          : [];
        setAnnouncements(visible);
        setFilteredAnnouncements(visible);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    fetch(window.API_BASE + "/api/announcements/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...announcements];

    // Search filter
    if (search.trim() !== "") {
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((a) => a.category_name === categoryFilter);
    }

    setFilteredAnnouncements(filtered);
  }, [search, categoryFilter, announcements]);

  const handleCreateAnnouncement = () => {
    navigate("/admin/announcementpage/announcementsubmission");
  };

  // Collect all category names
  const uniqueCategories = ["All", ...new Set([
    ...announcements.map((a) => a.category).filter(Boolean),
    ...categories.map((c) => c.category_name).filter(Boolean),
  ])];

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Announcement Management</h1>
        <button
          className="flex items-center space-x-2 bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-800 transition"
          onClick={handleCreateAnnouncement}
        >
          <Plus size={20} />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 mb-4">

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2 border flex-1">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search announcement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border shadow-sm text-sm bg-white"
        >
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 bg-red-700 text-white font-semibold text-sm p-4 sticky top-0 z-10">
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Created At</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann, index) => (
              <AnnouncementRow
                key={ann.announcement_id}
                announcement={ann}
                isHighlighted={index % 2 === 1}
                onView={setViewAnnouncement}
              />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No announcements found.
            </div>
          )}
        </div>
      </div>

      {viewAnnouncement && (
        <ViewModal
          announcement={viewAnnouncement}
          onClose={() => setViewAnnouncement(null)}
        />
      )}
    </div>
  );
};

export default AnnouncementManagementContent;
