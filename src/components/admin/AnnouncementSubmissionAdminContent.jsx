import React, { useState, useEffect } from "react";
import { Send, UploadCloud, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";
import ConfirmationModal from "../common/ConfirmationModal";
import SuccessModal from "../common/SuccessModal";

export default function AdminAnnouncementSubmissionForm() {
  const navigate = useNavigate();
  const { showError } = useError();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    category: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(window.API_BASE + "/api/announcements/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        const options = Array.isArray(data) ? data : [];
        setCategories(options);
        if (options.length > 0 && !formData.category_id) {
          setFormData((prev) => ({
            ...prev,
            category_id: String(options[0].id),
            category: options[0].category_name,
          }));
        }
      } catch (err) {
        console.error("Failed to load announcement categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    const required = ["title", "description", "category_id"];
    for (let f of required) {
      if (!formData[f]?.trim()) {
        showError(`Please fill in: ${f}`);
        return;
      }
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();

      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("category_id", formData.category_id);
      formDataObj.append("category", formData.category || "");
      if (formData.attachment) {
        formDataObj.append("attachment", formData.attachment);
      }

      const res = await fetch(window.API_BASE + "/api/announcements/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit announcement");
      }

      setShowSuccess(true);
      setFormData({
        title: "",
        description: "",
        category_id: categories[0]?.id ? String(categories[0].id) : "",
        category: categories[0]?.category_name || "",
        attachment: null,
      });
    } catch (err) {
      showError(err.message || "Failed to submit announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/admin/announcementpage");
  };

  return (
    <div className="flex-1 bg-gray-100 min-h-screen overflow-y-auto p-10">
      
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-in 
          ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.message}
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Announcement Submission"
        message="Are you sure you want to submit this announcement?"
        confirmText="Submit"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmation(false)}
        isLoading={loading}
      />

      <SuccessModal
        isOpen={showSuccess}
        title="Announcement Submitted Successfully"
        message="Your announcement has been created and is now live."
        actionText="OK"
        autoCloseMs={1500}
        onClose={handleSuccessClose}
      />

      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/announcementpage")}
          className="flex items-center gap-2 text-gray-700 hover:text-red-600 mb-6 transition font-medium"
        >
          <ArrowLeft size={20} />
          Back to Announcement Management
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Submit New Announcement</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to create a new announcement.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-8">

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    const selected = categories.find((cat) => String(cat.id) === e.target.value);
                    handleChange("category_id", e.target.value);
                    handleChange("category", selected?.category_name || "");
                  }}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="Write the announcement content"
              ></textarea>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Upload Attachment / Image (optional)</h2>

            <label className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-50">
              <UploadCloud size={22} className="text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Upload file</p>
                <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            {formData.attachment && (
              <p className="text-sm text-green-600 mt-2">
                File selected: {formData.attachment.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-md text-white
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {loading ? "Submitting..." : "Submit Announcement"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
