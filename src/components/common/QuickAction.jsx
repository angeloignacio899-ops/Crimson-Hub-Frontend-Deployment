import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="font-semibold mb-4">Quick Actions</h3>

      {/* Flex container to place buttons side by side */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Create Event Button */}
        <button
          onClick={() => navigate("/admin/eventpage/eventsubmission")}
          className="flex-1 bg-[#d64553] hover:bg-[#c43b48] text-white text-sm 
                     px-4 py-2 rounded-md transition flex items-center justify-center gap-2"
        >
          <MapPin size={16} /> Create Event
        </button>

        {/* Create Announcement Button */}
        <button
          onClick={() => navigate("/admin/announcementpage/announcementsubmission")}
          className="flex-1 bg-[#2b7a78] hover:bg-[#236e6c] text-white text-sm 
                     px-4 py-2 rounded-md transition flex items-center justify-center gap-2"
        >
          <MapPin size={16} /> Create Announcement
        </button>

      </div>
    </div>
  );
}
