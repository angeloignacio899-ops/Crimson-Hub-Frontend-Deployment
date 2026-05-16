import React from "react";

const AnnouncementDetailModal = ({ announcement, onClose }) => {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">{announcement.title}</h2>
        <p><strong>Category:</strong> {announcement.category}</p>
        <p><strong>Author:</strong> {announcement.organizer}</p>
        <p className="mt-2"><strong>Description:</strong> {announcement.description}</p>

        {announcement.file_name && (
          <div className="mt-4">
            <strong>Attachment:</strong>{" "}
            <a
              href={`${window.API_BASE}/uploads/announcements/${announcement.file_path}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {announcement.file_name}
            </a>
          </div>
        )}

        <p className="mt-4"><strong>Status:</strong> {announcement.status}</p>
      </div>
    </div>
  );
};

export default AnnouncementDetailModal;
