import { useState, useEffect } from "react";
import { Search, Eye, Download } from "lucide-react";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js"; // helper to include token in headers
import { useError } from "../../context/ErrorContext";
import ConfirmationModal from "../common/ConfirmationModal";
import SuccessModal from "../common/SuccessModal";

// ----- Helper: Format date/time -----
const formatDateTime = (date, time = null) => {
  if (!date) return "N/A";

  let parsed;
  try {
    // Check if date already has 'T' (full ISO)
    if (date.includes("T")) {
      parsed = new Date(date);
    } else if (time) {
      parsed = new Date(`${date}T${time}`);
    } else {
      parsed = new Date(date);
    }

    if (isNaN(parsed)) return "N/A";

    return parsed.toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
};



// ----- Status Tag -----
const StatusTag = ({ status }) => {
  let bgColor = "bg-gray-100 text-gray-800";
  if (status === "Pending" || status === "pending") bgColor = "bg-yellow-100 text-yellow-800";
  if (status === "Approved" || status === "approved") bgColor = "bg-green-100 text-green-800";
  if (status === "Rejected" || status === "rejected") bgColor = "bg-red-100 text-red-800";

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${bgColor}`}>
      {status}
    </span>
  );
};

// ----- View Modal -----
function ViewModal({ item, onClose, onApprove, onReject, isLoading }) {
  const [remarks, setRemarks] = useState("");

  if (!item) return null;

  const handleApprove = () => {
    onApprove({ ...item, remarks });
  };

  const handleReject = () => {
    onReject({ ...item, remarks });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{item.type} Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition font-bold text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Event Details */}
          {item.type === "Event" && (
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-start">
              <img
                src={`${window.API_BASE}/uploads/events/${item.event_image}` || "https://via.placeholder.com/150"}
                alt="Cover"
                className="rounded-lg w-full sm:w-48 object-cover mb-4 sm:mb-0"
              />
              <div className="flex-1 space-y-2">
                <p><span className="font-semibold">Title:</span> {item.title}</p>
                <p><span className="font-semibold">Category:</span> {item.category}</p>
                <p><span className="font-semibold">Organizer:</span> {item.organizer_name}</p>
                <p><span className="font-semibold">Location:</span> {item.location || "TBA"}</p>
                <p>
                  <span className="font-semibold">Start Date & Time:</span>{" "}
                  {formatDateTime(item.start_date, item.start_time)}
                </p>
                <p>
                  <span className="font-semibold">End Date & Time:</span>{" "}
                  {formatDateTime(item.end_date, item.end_time)}
                </p>
                <p><span className="font-semibold">Target Audience:</span> {item.audience || "All"}</p>
                <p><span className="font-semibold">Max Registration:</span> {item.number_of_registration || "Unlimited"}</p>
                <p>
                  <span className="font-semibold">Event Link:</span>{" "}
                  <a href={item.event_link || "#"} className="text-blue-600 hover:underline">
                    {item.event_link || "N/A"}
                  </a>
                </p>
                <p><span className="font-semibold">Description:</span> {item.description || "No description provided."}</p>
                {item.attachment && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Download size={16} className="text-gray-500" />
                    <a
                      href={item.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download Attachment
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Announcement Details */}
          {item.type === "Announcement" && (
            <div className="space-y-2">
              <p><span className="font-semibold">Title:</span> {item.title}</p>
              <p><span className="font-semibold">Category:</span> {item.category}</p>
              <p><span className="font-semibold">Author:</span> {item.author}</p>
              <p>
                <span className="font-semibold">Date & Time Created:</span>{" "}
                {formatDateTime(item.created_at)}
              </p>
              <p><span className="font-semibold">Description:</span> {item.description || "No description provided."}</p>
              {item.attachment && (
                <div className="flex items-center space-x-2 mt-2">
                  <Download size={16} className="text-gray-500" />
                  <a
                    href={item.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Admin Remarks */}
          <div className="mt-4">
            <label className="block font-semibold text-gray-700 mb-2">Admin Remarks:</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add notes or comments..."
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Pending Row -----
const PendingRow = ({ item, isHighlighted, onView }) => {
  const createdDate = formatDateTime(item.created_at);

  return (
    <div
      className={`grid grid-cols-7 gap-3 items-center p-3 text-sm border-b last:border-b-0 ${
        isHighlighted ? "bg-red-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="text-left truncate">{item.title}</div>
      <div className="text-center">{item.type}</div>
      <div className="text-center truncate">{item.category_name || item.category}</div>
      <div className="text-center truncate">{item.organizer_name || item.author}</div>
      <div className="text-center">{createdDate}</div>
      <div className="text-center">
        <StatusTag status={item.status} />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => onView(item)}
          className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition"
          title="View"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

// ----- Pending Approvals Page -----
const PendingApprovalsContent = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [viewItem, setViewItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { showError } = useError();

  // Fetch pending items on mount
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(window.API_BASE + "/api/pending", {
          method: "GET",
        });        
        const data = await res.json();
        setItems(data.items);
      } catch (err) {
        showError("Failed to load pending items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(search) ||
      (item.organizer_name || item.organizer || "").toLowerCase().includes(search);
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Approve / Reject
  const updateStatus = async (item, action) => {
    const id = item.type === "Event" ? item.event_id : item.announcement_id;

    try {
      await fetchWithAuth(window.API_BASE + "/api/pending/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: item.type, action, remarks: item.remarks || "" }),
      });

      setItems((prev) =>
        prev.map((i) => {
          const iId = i.type === "Event" ? i.event_id : i.announcement_id;
          return i.type === item.type && iId === id
            ? { ...i, status: action, remarks: item.remarks || "" }
            : i;
        })
      );

      setShowSuccess(true);
      setViewItem(null);
    } catch (err) {
      showError("Failed to update item status");
    }
  };

  const handleApprove = (item) => {
    setPendingAction({ item, action: "Approved" });
    setShowConfirmation(true);
  };

  const handleReject = (item) => {
    setPendingAction({ item, action: "Rejected" });
    setShowConfirmation(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      setShowConfirmation(false);
      updateStatus(pendingAction.item, pendingAction.action);
      setPendingAction(null);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Approvals</h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title or organizer..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-red-500 focus:border-red-500 transition"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Event</option>
          <option>Announcement</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-3 bg-red-700 text-white font-semibold text-sm p-4 sticky top-0">
          <div className="text-left">Title</div>
          <div className="text-center">Type</div>
          <div className="text-center">Category</div>
          <div className="text-center">Organizer</div>
          <div className="text-center">Created At</div>
          <div className="text-center">Status</div>
          <div className="text-center">Action</div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No pending items found</div>
          ) : (
            filteredItems.map((item, index) => (
              <PendingRow
                key={`${item.type}-${item.event_id || item.announcement_id}`}
                item={item}
                isHighlighted={index % 2 === 0}
                onView={(item) => setViewItem(item)}
              />
            ))
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <ViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={loading}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title={pendingAction?.action === "Approved" ? "Approve Item" : "Reject Item"}
        message={`Are you sure you want to ${pendingAction?.action?.toLowerCase()} this ${pendingAction?.item?.type?.toLowerCase()}?`}
        confirmText={pendingAction?.action}
        isDangerous={pendingAction?.action === "Rejected"}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingAction(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Success"
        message={pendingAction?.action === "Approved" ? `${pendingAction?.item?.type} has been approved successfully.` : `${pendingAction?.item?.type} has been rejected successfully.`}
        actionText="OK"
        autoCloseMs={2000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default PendingApprovalsContent;
