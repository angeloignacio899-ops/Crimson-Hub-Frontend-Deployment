import React, { useState, useEffect } from "react";
import { Trash2, Plus, Edit2, X } from "lucide-react";
import { useError } from "../../context/ErrorContext";
import ConfirmationModal from "../common/ConfirmationModal";
import SuccessModal from "../common/SuccessModal";

const SettingContent = () => {
  const { showError } = useError();
  const [activeTab, setActiveTab] = useState("archive");
  
  // Archive states
  const [archivedFilter, setArchivedFilter] = useState("all");
  const [archivedData, setArchivedData] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(true);
  const [archivedError, setArchivedError] = useState("");
  const [archivedPage, setArchivedPage] = useState(1);
  const [archivedTotalPages, setArchivedTotalPages] = useState(1);

  // Category states
  const [categories, setCategories] = useState([]);
  const [announcementCategories, setAnnouncementCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAnnouncementCategories, setLoadingAnnouncementCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [announcementCategoryError, setAnnouncementCategoryError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAnnouncementCategoryModal, setShowAnnouncementCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });
  const [announcementCategoryForm, setAnnouncementCategoryForm] = useState({
    name: ""
  });

  // Archive Modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedArchiveItem, setSelectedArchiveItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);

  // ================== ARCHIVE FUNCTIONS ==================
  const fetchArchived = async () => {
    try {
      setLoadingArchived(true);
      setArchivedError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setArchivedError("You must be logged in.");
        setArchivedData([]);
        return;
      }

      const params = new URLSearchParams({
        page: archivedPage.toString(),
        pageSize: "10",
      });

      if (archivedFilter !== "all") {
        params.set("type", archivedFilter);
      }

      const res = await fetch(`${window.API_BASE}/api/archived?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Server error: " + res.status);

      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setArchivedData(data.items);
        setArchivedTotalPages(data.pagination?.totalPages || 1);
      } else {
        setArchivedData([]);
        setArchivedTotalPages(1);
      }
    } catch (err) {
      setArchivedError(err.message);
      setArchivedData([]);
      setArchivedTotalPages(1);
    } finally {
      setLoadingArchived(false);
    }
  };

  const handleDeleteArchive = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(window.API_BASE + "/api/archived/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, type }),
      });

      const data = await res.json();
      if (data.success) {
        fetchArchived();
        setShowArchiveModal(false);
        setSelectedArchiveItem(null);
      } else {
        showError(data.message || "Failed to delete item");
      }
    } catch (err) {
      showError(err.message || "Failed to delete item");
    }
  };

  // ================== CATEGORY FUNCTIONS ==================
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setCategoryError("You must be logged in.");
        return;
      }

      const res = await fetch(window.API_BASE + "/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Server error: " + res.status);

      const data = await res.json();
      // Handle both direct array response and wrapped response
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategoryError(err.message);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const getStoredAnnouncementCategories = () => {
    try {
      const stored = localStorage.getItem("announcementCategories");
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to parse stored announcement categories", err);
      return [];
    }
  };

  const saveAnnouncementCategories = (categories) => {
    localStorage.setItem("announcementCategories", JSON.stringify(categories));
  };

  const fetchAnnouncementCategories = async () => {
    try {
      setLoadingAnnouncementCategories(true);
      setAnnouncementCategoryError("");

      const res = await fetch(`${window.API_BASE}/api/announcements/approved`);
      if (!res.ok) throw new Error("Server error: " + res.status);

      const data = await res.json();
      const storedCategories = getStoredAnnouncementCategories();
      const grouped = new Map();

      storedCategories.forEach((category) => {
        grouped.set(category.name.toLowerCase(), {
          name: category.name,
          count: Number(category.count) || 0,
        });
      });

      (Array.isArray(data) ? data : []).forEach((item) => {
        const name = item.category?.trim();
        if (!name) return;

        const key = name.toLowerCase();
        if (!grouped.has(key)) {
          grouped.set(key, { name, count: 0 });
        }

        grouped.get(key).count += 1;
      });

      const sortedCategories = Array.from(grouped.values()).sort((a, b) => a.name.localeCompare(b.name));
      setAnnouncementCategories(sortedCategories);
      saveAnnouncementCategories(sortedCategories);
    } catch (err) {
      setAnnouncementCategoryError(err.message);
      setAnnouncementCategories(getStoredAnnouncementCategories());
    } finally {
      setLoadingAnnouncementCategories(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      showError("Category name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingCategory
        ? `${window.API_BASE}/api/categories/${editingCategory.category_id}`
        : window.API_BASE + "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_name: categoryForm.name,
          description: categoryForm.description,
        }),
      });

      const data = await res.json();
      const isSuccess = data?.success === true || data?.category_id || data?.message;

      if (isSuccess) {
        setSuccessMessage(editingCategory ? "Category updated successfully" : "Category created successfully");
        setShowSuccess(true);
        fetchCategories();
        resetCategoryForm();
      } else {
        showError(data.message || "Failed to save category");
      }
    } catch (err) {
      showError(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${window.API_BASE}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const isSuccess = data?.success === true || data?.message;

      if (isSuccess) {
        setSuccessMessage("Category deleted successfully");
        setShowSuccess(true);
        fetchCategories();
      } else {
        showError(data.message || "Failed to delete category");
      }
    } catch (err) {
      showError(err.message || "Failed to delete category");
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "" });
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const resetAnnouncementCategoryForm = () => {
    setAnnouncementCategoryForm({ name: "" });
    setShowAnnouncementCategoryModal(false);
  };

  const handleAddAnnouncementCategory = (e) => {
    e.preventDefault();

    const name = announcementCategoryForm.name.trim();
    if (!name) {
      showError("Announcement category name is required");
      return;
    }

    const normalizedName = name.toLowerCase();
    const exists = announcementCategories.some((category) => category.name.toLowerCase() === normalizedName);

    if (exists) {
      showError("Announcement category already exists");
      return;
    }

    const updated = [{ name, count: 0 }, ...announcementCategories].sort((a, b) => a.name.localeCompare(b.name));
    setAnnouncementCategories(updated);
    saveAnnouncementCategories(updated);
    setSuccessMessage("Announcement category added successfully");
    setShowSuccess(true);
    resetAnnouncementCategoryForm();
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.category_name,
      description: category.description || "",
    });
    setShowCategoryModal(true);
  };

  // ================== EFFECTS ==================
  useEffect(() => {
    fetchCategories();
    fetchAnnouncementCategories();
  }, []);

  useEffect(() => {
    if (activeTab === "archive") {
      fetchArchived();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archivedFilter, archivedPage, activeTab]);

  const handleArchiveFilterChange = (filter) => {
    setArchivedFilter(filter);
    setArchivedPage(1);
  };

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-2rem)] p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage archived items and system configurations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("archive")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "archive"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Archive Management
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "categories"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Category Management
        </button>
      </div>

      {/* ================== ARCHIVE TAB ================== */}
      {activeTab === "archive" && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Archived Items</h2>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 space-y-2 sm:space-y-0">
            <label className="text-gray-700 font-medium">Filter by type:</label>
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={archivedFilter}
              onChange={e => handleArchiveFilterChange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Event">Events</option>
              <option value="Announcement">Announcements</option>
            </select>
          </div>

          {/* Loading / Error */}
          {loadingArchived && <p className="text-gray-500">Loading archived items...</p>}
          {archivedError && <p className="text-red-500">{archivedError}</p>}

          {/* Table */}
          {!loadingArchived && !archivedError && (
            <div className="overflow-x-auto">
              <div className="min-w-full rounded-lg border border-gray-200">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 bg-gray-100 p-4 rounded-t-lg">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-200">
                  {archivedData.length > 0 ? (
                    archivedData.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition"
                      >
                        <div className="col-span-5 font-medium text-gray-800">{item.title}</div>
                        <div className="col-span-2 text-gray-600">{item.type}</div>
                        <div className="col-span-3 text-gray-600">{item.date}</div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => {
                              setSelectedArchiveItem(item);
                              setShowArchiveModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-gray-500 text-center">
                      No archived items found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination controls */}
          {!loadingArchived && !archivedError && archivedTotalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Page {archivedPage} of {archivedTotalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setArchivedPage((prev) => Math.max(1, prev - 1))}
                  disabled={archivedPage <= 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setArchivedPage((prev) => Math.min(archivedTotalPages, prev + 1))}
                  disabled={archivedPage >= archivedTotalPages}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================== CATEGORIES TAB ================== */}
      {activeTab === "categories" && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Event & Announcement Categories</h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              <Plus size={20} />
              Add Event Category
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Event Categories</h3>
              <p className="text-sm text-gray-500">Managed for event submissions and filtering.</p>
            </div>

            {/* Loading / Error */}
            {loadingCategories && <p className="text-gray-500">Loading event categories...</p>}
            {categoryError && <p className="text-red-500">{categoryError}</p>}

            {/* Event Categories Table */}
            {!loadingCategories && !categoryError && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Category Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-700">Events Count</th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <tr
                          key={category.category_id}
                          className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">{category.category_name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{category.description || "—"}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {category.event_count || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center flex justify-center gap-3">
                            <button
                              onClick={() => openEditCategory(category)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition text-sm font-medium"
                              title="Edit category"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.category_id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm font-medium"
                              title="Delete category"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-gray-500 text-center">
                          No event categories found. Create one to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Announcement Categories</h3>
              <button
                onClick={() => setShowAnnouncementCategoryModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition font-medium"
              >
                <Plus size={18} />
                Add Announcement Category
              </button>
            </div>

            {loadingAnnouncementCategories && <p className="text-gray-500">Loading announcement categories...</p>}
            {announcementCategoryError && <p className="text-red-500">{announcementCategoryError}</p>}

            {!loadingAnnouncementCategories && !announcementCategoryError && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Category Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Announcements Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcementCategories.length > 0 ? (
                      announcementCategories.map((category, index) => (
                        <tr
                          key={category.name}
                          className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">{category.name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {category.count}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="p-8 text-gray-500 text-center">
                          No announcement categories found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================== ARCHIVE DELETE MODAL ================== */}
      {showArchiveModal && selectedArchiveItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedArchiveItem.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedArchiveItem(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                onClick={() => handleDeleteArchive(selectedArchiveItem.id, selectedArchiveItem.type)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================== ANNOUNCEMENT CATEGORY MODAL ================== */}
      {showAnnouncementCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Announcement Category</h3>
              <button
                onClick={resetAnnouncementCategoryForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAnnouncementCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={announcementCategoryForm.name}
                  onChange={(e) => setAnnouncementCategoryForm({ name: e.target.value })}
                  placeholder="e.g., Campus, General"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                  onClick={resetAnnouncementCategoryForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================== CATEGORY MODAL ================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={resetCategoryForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Sports, Cultural, Academic"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Describe this category..."
                  rows="4"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                  onClick={resetCategoryForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition font-medium"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingContent;
