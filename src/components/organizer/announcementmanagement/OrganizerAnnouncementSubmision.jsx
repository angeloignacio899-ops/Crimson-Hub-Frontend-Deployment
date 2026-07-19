import React, { useState } from "react";
import { Send, UploadCloud, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../../context/ErrorContext";
import ConfirmationModal from "../../common/ConfirmationModal";
import SuccessModal from "../../common/SuccessModal";

export default function OrganizerAnnouncementSubmissionForm() {
    const navigate = useNavigate();
    const { showError } = useError();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        author: "",
        attachment: null,
    });

    const [loading, setLoading] = useState(false); 
    const [redirecting, setRedirecting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
    };

    const handleSubmit = async () => {
        const required = ["title", "description", "category", "author"];
        for (let field of required) {
            if (!formData[field] || formData[field].trim() === "") {
                showError(`Please fill in: ${field}`);
                return;
            }
        }

        const token = localStorage.getItem("token");
        if (!token) {
            showError("Unauthorized! Please log in.");
            return;
        }

        // Show confirmation modal
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmation(false);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("author", formData.author);

            if (formData.attachment) {
                data.append("attachment", formData.attachment);
            }

            const res = await fetch(window.API_BASE + "/api/announcements/create", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Submission failed");
            }

            // ✔ SUCCESS — Show modal
            setShowSuccess(true);

            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                author: "",
                attachment: null,
            });

        } catch (error) {
            showError(error.message || "Failed to submit announcement");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate("/organizer/announcementmanagement");
    };

    return (
        <div className="relative">

            {/* 🔥 FULLSCREEN MODERN LOADING SCREEN */}
            {redirecting && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
                    <Loader2 className="animate-spin text-red-600" size={50} />
                    <p className="mt-4 text-lg font-semibold text-gray-700">
                        Announcement Created: Redirecting to Announcement Management...
                    </p>
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
                autoCloseMs={2000}
                onClose={handleSuccessClose}
            />

            {/* MAIN PAGE */}
            <div className="flex-1 bg-gray-100 min-h-screen overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto">

                    <button
                        onClick={() => navigate("/organizer/announcementmanagement")}
                        className="flex items-center gap-2 text-gray-700 hover:text-red-600 mb-6 transition font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back to Announcement Management
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Submit New Announcement</h1>
                    <p className="text-gray-500 mb-8">Fill in the details below.</p>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-8">
                        
                        {/* Form Inputs */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Title *</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Category *</label>
                                    <select
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                                        value={formData.category}
                                        onChange={(e) => handleChange("category", e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        <option value="General">General</option>
                                        <option value="Memo">Memo</option>
                                        <option value="Reminder">Reminder</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Author *</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                                        value={formData.author}
                                        onChange={(e) => handleChange("author", e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="mt-6">
                                <label className="text-sm font-medium text-gray-600">Description *</label>
                                <textarea
                                    rows="4"
                                    className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Upload File (optional)</h2>

                            <label className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                                <UploadCloud className="text-gray-600" size={22} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Upload file</p>
                                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>

                            {formData.attachment && (
                                <p className="text-sm text-green-700 mt-2">
                                    Selected file: {formData.attachment.name}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 font-medium shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Announcement
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
