import { AlertCircle, X } from "lucide-react";

export default function DeleteUserModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-red-100">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">
            {user.firstname} {user.lastname}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
