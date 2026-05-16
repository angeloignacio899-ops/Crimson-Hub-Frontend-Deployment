import { useState, useEffect } from "react";
import { Send, UploadCloud, ArrowLeft, X, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../../context/ErrorContext";
import ConfirmationModal from "../../common/ConfirmationModal";
import SuccessModal from "../../common/SuccessModal";

// Feedback component
const FeedbackMessage = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = "fixed top-4 right-4 p-4 rounded-xl shadow-lg flex items-center gap-3 z-50 transition-transform transform";
    let styleClasses = "";
    let Icon = AlertTriangle;

    if (type === 'success') {
        styleClasses = "bg-green-100 text-green-800 border-l-4 border-green-500";
        Icon = CheckCircle;
    } else {
        styleClasses = "bg-red-100 text-red-800 border-l-4 border-red-500";
    }

    return (
        <div className={`${baseClasses} ${styleClasses} animate-slide-in-right`}>
            <Icon size={20} />
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
                <X size={16} />
            </button>
        </div>
    );
};

export default function OrganizerEventSubmissionForm() {
    const navigate = useNavigate();
    const { showError } = useError();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        organizer: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: "",
        eventLink: "",
        targetAudience: "",
        number_of_registration: "",
        allow_joining: true
    });

    const [categories, setCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState("error");
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [attachmentFile, setAttachmentFile] = useState(null);
    const [eventImageFile, setEventImageFile] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    // =========================================================
    // FETCH CATEGORIES ON MOUNT
    // =========================================================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log("📡 Fetching categories from API...");
                const res = await fetch(window.API_BASE + "/api/categories");
                console.log("📊 API Response Status:", res.status);
                if (res.ok) {
                    const data = await res.json();
                    console.log("✅ Categories fetched successfully:", data);
                    setCategories(data);
                } else {
                    showError("Failed to load categories");
                }
            } catch (err) {
                showError("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    const audienceSuggestions = [
        "School-wide (All students and faculty)",
        "CCS Department",
        "CLA Department",
        "1st Year Students",
        "2nd Year Students",
        "3rd Year Students",
        "4th Year Students",
    ];

    const filteredSuggestions = audienceSuggestions.filter(item =>
        item.toLowerCase().includes(formData.targetAudience.toLowerCase())
    );

    const handleChange = (field, value) => setFormData({ ...formData, [field]: value });
    const handleFileChange = e => setAttachmentFile(e.target.files[0]);
    const handleImageChange = e => setEventImageFile(e.target.files[0]);
    const handleCloseFeedback = () => setFeedbackMessage(null);

    const handleSubmit = async () => {
        setFeedbackMessage(null);

        // Validate required fields
        const requiredFields = ["title", "description", "category_id", "organizer", "startDate", "endDate", "startTime", "endTime", "location", "targetAudience"];
        for (let field of requiredFields) {
            if (!formData[field]?.toString().trim()) {
                showError(`Please fill in the required field: ${field.replace(/([A-Z])/g, " $1")}`);
                return;
            }
        }

        // Show confirmation modal
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmation(false);
        setIsLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => value && data.append(key, value));
            if (attachmentFile) data.append("attachment", attachmentFile);
            if (eventImageFile) data.append("event_image", eventImageFile);

            const token = localStorage.getItem("token"); // make sure your user is logged in

            const res = await fetch(window.API_BASE + "/api/events", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`  // include token for auth
                },
                body: data
            });

            const result = await res.json();

            if (res.ok) {
                setShowSuccess(true);
                // reset form
                setFormData({
                    title: "", description: "", category_id: "", organizer: "",
                    startDate: "", endDate: "", startTime: "", endTime: "", location: "", eventLink: "",
                    targetAudience: "", number_of_registration: ""
                });
                setAttachmentFile(null);
                setEventImageFile(null);
            } else {
                setFeedbackType("error");
                setFeedbackMessage(result.message || "An error occurred.");
            }
        } catch (err) {
            showError("Failed to connect to the server");
            setFeedbackType("error");
            setFeedbackMessage("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate("/organizer/eventmanagement");
    };

    return (
        <>
            <style>
                {`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
                `}
            </style>

            <FeedbackMessage message={feedbackMessage} type={feedbackType} onClose={handleCloseFeedback} />

            <ConfirmationModal
                isOpen={showConfirmation}
                title="Confirm Event Submission"
                message="Are you sure you want to submit this event? It will be sent for admin approval."
                confirmText="Submit Event"
                onConfirm={handleConfirmSubmit}
                onCancel={() => setShowConfirmation(false)}
                isLoading={isLoading}
            />

            <SuccessModal
                isOpen={showSuccess}
                title="Event Submitted Successfully"
                message="Your event has been submitted for admin approval. Redirecting to event management..."
                actionText="OK"
                autoCloseMs={3000}
                onClose={handleSuccessClose}
            />

            <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto p-4 sm:p-10 font-sans">
                <div className="max-w-6xl mx-auto">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/organizer/eventmanagement")}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 transition font-medium text-sm"
                        disabled={isLoading}
                    >
                        <ArrowLeft size={18} /> Back to Event Management
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-800">Submit New Event</h1>
                        <p className="text-gray-500 mt-1 text-base">
                            Provide the details below to submit a new event and optionally attach supporting files.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8">

                        {/* --- Basic Info --- */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        placeholder="Event title"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">
                                        Category * 
                                        {categories.length > 0 && <span className="text-xs text-green-600 ml-2">({categories.length} available)</span>}
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => {
                                            console.log("Selected category:", e.target.value);
                                            handleChange("category_id", e.target.value);
                                        }}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-white"
                                        disabled={isLoading || categories.length === 0}
                                    >
                                        <option value="">-- Select a Category --</option>
                                        {categories && categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <option key={cat.category_id} value={cat.category_id}>
                                                    {cat.category_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Loading categories...</option>
                                        )}
                                    </select>
                                </div>

                                {/* Organizer */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Organizer *</label>
                                    <input
                                        type="text"
                                        value={formData.organizer}
                                        onChange={(e) => handleChange("organizer", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        placeholder="Organizer name or department"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Location *</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        placeholder="Physical venue or virtual link"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="text-sm font-semibold text-gray-600">Description *</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="Describe the event..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* --- Timing & Access --- */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Timing and Access</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Start Date */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">End Date *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Start Time */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Start Time *</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => handleChange("startTime", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* End Time */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">End Time *</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => handleChange("endTime", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Event Link (optional) */}
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Event Link (optional)</label>
                                <input
                                    type="url"
                                    value={formData.eventLink}
                                    onChange={(e) => handleChange("eventLink", e.target.value)}
                                    className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="Zoom/Meet/Registration URL"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* --- Audience & Capacity --- */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Audience and Capacity</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Target Audience *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.targetAudience}
                                            onChange={(e) => handleChange("targetAudience", e.target.value)}
                                            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                            placeholder="Type or select audience"
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                            disabled={isLoading}
                                        />
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full bg-white border rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto">
                                                {filteredSuggestions.length > 0 ? filteredSuggestions.map((item, i) => (
                                                    <div key={i} className="px-4 py-2 cursor-pointer hover:bg-red-50"
                                                        onMouseDown={() => { handleChange("targetAudience", item); setShowDropdown(false); }}>
                                                        {item}
                                                    </div>
                                                )) : (
                                                    <div className="px-4 py-2 text-gray-500 italic">No matches</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Max Registrations (optional)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.number_of_registration}
                                        onChange={(e) => handleChange("number_of_registration", e.target.value)}
                                        className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300"
                                        placeholder="e.g., 50"
                                        disabled={!formData.allow_joining || isLoading}
                                    />
                                </div>
                            </div>

                            {/* --- Allow Joining Toggle --- */}
                            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={formData.allow_joining}
                                    onChange={(e) => handleChange("allow_joining", e.target.checked)}
                                    className="w-5 h-5 cursor-pointer accent-red-600"
                                    disabled={isLoading}
                                />
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 cursor-pointer">Allow Users to Join This Event</label>
                                    <p className="text-xs text-gray-600 mt-1">When enabled, users will see the "Join Now" button. Disable this to close registrations.</p>
                                </div>
                            </div>
                        </div>

                        {/* --- File Uploads --- */}
                        {[
                            { label: "Upload Event Image *", file: eventImageFile, handler: handleImageChange, required: true, accept: "image/*" },
                            { label: "Upload Attachment (optional)", file: attachmentFile, handler: handleFileChange, required: false, accept: "*/*" }
                        ].map(({ label, file, handler, accept }) => (
                            <div key={label}>
                                <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">{label}</h2>
                                <label className={`flex items-center gap-4 border-2 p-5 rounded-xl cursor-pointer transition ${file ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-red-500 hover:bg-gray-50"}`}>
                                    <UploadCloud size={24} className={file ? "text-green-600" : "text-gray-600"} />
                                    <div>
                                        <p className="text-base font-semibold text-gray-700">{file ? `Selected: ${file.name}` : `Click to select ${label.toLowerCase()}`}</p>
                                        <p className="text-sm text-gray-500">Max size 10MB. {accept === "image/*" ? "JPG, PNG" : "PDF, DOCX, JPG, PNG"}</p>
                                    </div>
                                    <input type="file" className="hidden" accept={accept} onChange={handler} disabled={isLoading} />
                                </label>
                                {file && (
                                    <button onClick={() => (file === eventImageFile ? setEventImageFile(null) : setAttachmentFile(null))}
                                        className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                        disabled={isLoading}>
                                        <X size={12} /> Remove
                                    </button>
                                )}
                                {file === eventImageFile && file && (
                                    <div className="mt-2 w-48 h-48 border border-gray-300 rounded-lg overflow-hidden cursor-pointer" onClick={() => setShowImageModal(true)}>
                                        <img src={URL.createObjectURL(file)} alt="Event Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* --- Submit Button --- */}
                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`px-8 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 font-semibold shadow-lg transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"}`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (<><Send size={18} /> Submit Event</>)}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- IMAGE MODAL --- */}
            {showImageModal && eventImageFile && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-3xl max-h-[90vh]">
                        <img src={URL.createObjectURL(eventImageFile)} alt="Full Event Preview" className="w-full h-auto rounded-lg object-contain" />
                        <button onClick={() => setShowImageModal(false)} className="absolute top-2 right-2 text-white hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
