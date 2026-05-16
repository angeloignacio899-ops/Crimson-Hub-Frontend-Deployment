import React, { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { useError } from "../../../context/ErrorContext";

const AnnouncementDetailModal = ({ announcementId, onClose }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useError();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await fetch(`${window.API_BASE}/api/announcements/${announcementId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch announcement");
        }

        const data = await res.json();
        setAnnouncement(data);
      } catch (err) {
        const message = err.message || "Failed to load announcement";
        setError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    if (announcementId) fetchAnnouncement();
  }, [announcementId]);

  // Close modal if no ID
  if (!announcementId) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl relative p-6 sm:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
        >
          <X size={24} />
        </button>

        {/* Loading */}
        {loading && <p className="text-gray-600">Loading announcement...</p>}

        {/* Error */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Announcement Details */}
        {!loading && !error && announcement && (
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800">{announcement.title}</h1>

            {/* Category, Author, Date */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{announcement.category}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Posted By: {announcement.author}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {new Date(announcement.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <div>
              <strong>Description:</strong>
              <p className="whitespace-pre-line mt-1 text-gray-700">{announcement.description}</p>
            </div>

            {/* Attachment */}
            {announcement.file_name && (
              <a
                href={announcement.file_url || "#"}
                download={announcement.file_name}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Download size={16} /> Download File
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetailModal;
