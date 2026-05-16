export default function NotificationHeader({ unreadCount, onMarkAllRead }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b border-gray-300 rounded-t-lg">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <p className="text-sm text-gray-500">
          You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
        </p>
      </div>

      <button
        onClick={onMarkAllRead}
        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm font-semibold px-4 py-1.5 rounded-md transition"
      >
        Mark All as Read
      </button>
    </div>
  );
}
