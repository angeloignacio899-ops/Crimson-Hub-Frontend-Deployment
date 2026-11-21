import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, X } from "lucide-react";
import { fetchUsers, deleteUser, updateUser } from "../../api/userApi";
import DeleteUserModal from "./DeleteUserModal";
import { motion, AnimatePresence } from "framer-motion";
import { useError } from "../../context/ErrorContext";
import ConfirmationModal from "../common/ConfirmationModal";
import SuccessModal from "../common/SuccessModal";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

// --- Role mappings ---
const ROLE_MAP = { 1: "Student", 2: "Organizer", 3: "Admin" };

// 🟥 Role Tag component
const RoleTag = ({ role_id }) => {
  const role = ROLE_MAP[role_id] || "Unknown";
  let bgColor, textColor;

  switch (role) {
    case "Admin":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "Organizer":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "Student":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {role}
    </span>
  );
};

// 🟩 Status Tag component
const StatusTag = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch ((status || "").toLowerCase()) {
    case "active":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "inactive":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "banned":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      break;
    default:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {status || "Unknown"}
    </span>
  );
};

// 🟦 VIEW USER MODAL
function ViewUserModal({ user, onClose, onApprove, onReject }) {
  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-[420px] max-w-[90%] p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
          >
            <X size={22} />
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-3">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  👤
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-gray-500 text-sm mb-3">{user.email}</p>

            {/* Role Tag */}
            <RoleTag role_id={user.role_id} />
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-200" />

          {/* User Details */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
            <p><span className="font-semibold">Student ID:</span> {user.student_id || "N/A"}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone || "N/A"}</p>
            <p><span className="font-semibold">Department:</span> {user.department || "N/A"}</p>
            <p><span className="font-semibold">Course:</span> {user.course || "N/A"}</p>
            <p><span className="font-semibold">Year:</span> {user.year_level || "N/A"}</p>
            <p><span className="font-semibold">Gender:</span> {user.gender || "N/A"}</p>
          </div>

          {/* Approve button only for pending organizers */}
          {(user.status || "").toLowerCase() === "pending" && user.role_id === null && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => onApprove(user)}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Approve Organizer
              </button>
              <button
                onClick={() => onReject(user)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Reject Request
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 🟧 EDIT USER MODAL
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    department: user.department || "",
    role_id: user.role_id || 1,
    status: user.status || "Inactive",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90%] p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Edit User Details</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {["firstname", "lastname", "email", "department"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{field.replace(/^./, c => c.toUpperCase())}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            ))}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value={1}>Student</option>
                <option value={2}>Organizer</option>
                <option value={3}>Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 🟨 User row in table
const UserRow = ({ user, isHighlighted, onViewClick, onEditClick, onDeleteClick }) => {
  const canDelete = ["inactive", "banned"].includes((user.status || "").toLowerCase());
  // Format last_active nicely
  const formattedLastActive = user.last_active
    ? new Date(user.last_active).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div
      className={`grid grid-cols-9 gap-2 items-center p-3 text-sm border-b last:border-b-0 ${
        isHighlighted ? "bg-red-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="col-span-2 font-semibold text-gray-800 truncate">
        {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : "Unnamed User"}
      </div>
      <div className="col-span-2 text-gray-600 text-xs truncate">
        {user.email || "No Email Provided"}
      </div>
      <div className="col-span-1">
        <RoleTag role_id={user.role_id} />
      </div>
      <div className="col-span-1 text-gray-600 text-xs truncate">{user.department || "N/A"}</div>
      <div className="col-span-1 text-center">
        <StatusTag status={user.status} />
      </div>
      <div className="col-span-1 text-center text-gray-600 text-xs truncate">
        {formattedLastActive}
      </div>
      <div className="col-span-1 flex justify-center space-x-2">
        <button
          onClick={() => onViewClick(user)}
          className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onEditClick(user)}
          className="text-gray-500 hover:text-yellow-600 p-1 rounded-full hover:bg-yellow-50 transition"
        >
          <Edit size={16} />
        </button>
        <button
          disabled={!canDelete}
          onClick={() => onDeleteClick(user)}
          title={canDelete ? "Delete account" : "Only inactive or banned accounts can be deleted"}
          className={`p-1 rounded-full transition ${
            canDelete
              ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};



// 🟫 Main content
export default function UserManagementContent() {
  const { showError } = useError();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingOrganizerAction, setPendingOrganizerAction] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      if (Array.isArray(data)) setUsers(data);
    };
    loadUsers();
  }, []);

  // Delete user
  const handleConfirmDelete = async (userId) => {
    try {
      const success = await deleteUser(userId);
      if (success) {
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      } else {
        showError("Account could not be deleted.");
      }
    } catch (err) {
      showError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete account."
      );
    } finally {
      setSelectedUser(null);
    }
  };

  // Confirm organizer requests before changing their account status.
  const requestOrganizerAction = (user, action) => {
    setPendingUser(user);
    setPendingOrganizerAction(action);
    setShowConfirmation(true);
  };

  // Approve or reject a pending organizer request.
  const handleConfirmOrganizerAction = async () => {
    const user = pendingUser;
    const action = pendingOrganizerAction;
    if (!user || !action) return;

    setIsSaving(true);

    try {
      const isApproval = action === "approve";
      const endpoint = isApproval ? "approve-organizer" : "reject-organizer";
      const res = await fetchWithAuth(`${window.API_BASE}/api/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id
            ? { ...u, status: isApproval ? "Active" : "Rejected", role_id: isApproval ? 2 : u.role_id }
            : u
        )
      );
      setSuccessTitle(isApproval ? "Organizer Approved" : "Organizer Request Rejected");
      setSuccessMessage(
        isApproval
          ? `${user.firstname} ${user.lastname} has been approved as an organizer.`
          : data.emailSent
            ? `${user.firstname} ${user.lastname}'s organizer request was rejected and an email was sent.`
            : `${user.firstname} ${user.lastname}'s organizer request was rejected, but the notification email could not be sent.`
      );
      setShowSuccess(true);
      setViewUser(null);
    } catch (err) {
      showError(err.message || `Error ${action === "approve" ? "approving" : "rejecting"} organizer request`);
    } finally {
      setShowConfirmation(false);
      setPendingUser(null);
      setPendingOrganizerAction(null);
      setIsSaving(false);
    }
  };

  // Confirm user changes
  const handleConfirmChanges = async () => {
    setShowConfirmation(false);
    if (!pendingChanges) return;

    setIsSaving(true);
    try {
      await updateUser(pendingChanges.user_id, pendingChanges);
      setUsers((prev) =>
        prev.map((u) => (u.user_id === pendingChanges.user_id ? { ...u, ...pendingChanges } : u))
      );
      setSuccessTitle("User Updated");
      setSuccessMessage("User information has been updated successfully.");
      setShowSuccess(true);
      setEditUser(null);
      setPendingChanges(null);
    } catch (err) {
      showError("Error updating user");
      setPendingChanges(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter users
  const filtered = users
    .filter((u) => {
      const fullName = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .filter((u) => roleFilter === "All" || ROLE_MAP[u.role_id] === roleFilter);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header + Filter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex justify-center w-full rounded-lg bg-red-700 px-4 py-2 text-white font-semibold hover:bg-red-800 focus:outline-none"
          >
            {roleFilter}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.243a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              {["All", "Admin", "Organizer", "Student"].map((role) => (
                <li
                  key={role}
                  onClick={() => {
                    setRoleFilter(role);
                    setDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100 cursor-pointer"
                >
                  {role}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-9 gap-4 bg-red-700 text-white font-semibold text-sm p-4">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-1">Role</div>
          <div className="col-span-1">Department</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Last Active</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length ? (
            filtered.map((u, i) => (
              <UserRow
                key={u.user_id || i}
                user={u}
                isHighlighted={i % 2 === 0}
                onViewClick={setViewUser}
                onEditClick={setEditUser}
                onDeleteClick={setSelectedUser}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">No users found.</div>
          )}
        </div>
      </div>

      {/* Modals */}
      {viewUser && (
        <ViewUserModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onApprove={(user) => requestOrganizerAction(user, "approve")}
          onReject={(user) => requestOrganizerAction(user, "reject")}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation && !!pendingOrganizerAction}
        title={pendingOrganizerAction === "reject" ? "Reject Organizer Request" : "Approve Organizer"}
        message={`Are you sure you want to ${pendingOrganizerAction === "reject" ? "reject" : "approve"} ${pendingUser?.firstname} ${pendingUser?.lastname}'s organizer request?`}
        confirmText={pendingOrganizerAction === "reject" ? "Reject" : "Approve"}
        isDangerous={pendingOrganizerAction === "reject"}
        isLoading={isSaving}
        onConfirm={handleConfirmOrganizerAction}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingUser(null);
          setPendingOrganizerAction(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title={successTitle}
        message={successMessage}
        actionText="OK"
        autoCloseMs={2000}
        onClose={() => setShowSuccess(false)}
      />

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(updatedUser) => {
            // Show confirmation modal instead of saving directly
            setPendingChanges(updatedUser);
            setShowConfirmation(true);
          }}
        />
      )}
      {selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onConfirm={() => handleConfirmDelete(selectedUser.user_id)}
          onCancel={() => setSelectedUser(null)}
        />
      )}

      {/* Edit User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation && !!pendingChanges}
        title="Save Changes"
        message={`Are you sure you want to update ${pendingChanges?.firstname || ""} ${pendingChanges?.lastname || ""}'s information?`}
        confirmText="Save"
        onConfirm={handleConfirmChanges}
        onCancel={() => {
          setShowConfirmation(false);
          setPendingChanges(null);
        }}
        isLoading={isSaving}
      />
    </div>
  );
}
