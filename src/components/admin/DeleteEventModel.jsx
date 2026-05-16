export default function DeleteEventModal({ event, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Confirm Delete
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the event{" "}
          <span className="font-medium text-red-600">
            {event.title}
          </span>
          ?
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
