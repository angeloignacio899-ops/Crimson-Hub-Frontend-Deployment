import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import AboutEventCard from "../components/user/AbouteventCard";
import EventDetailsSection from "../components/user/EventdetailSection";
import AttachmentFile from "../components/organizer/AttachmentFile";
import OrganizerSection from "../components/organizer/OrganizerSection";
import CommentSection from "../components/user/CommentSection";
import ConfirmationModal from "../components/common/ConfirmationModal";
import SuccessModal from "../components/common/SuccessModal";
import { useError } from "../context/ErrorContext";
import axios from "axios";

export default function EventDetails() {
  const { id } = useParams();
  const { showError } = useError();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch event details
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${window.API_BASE}/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.event_id) {
          setLoading(false);
          return;
        }
        setEvent(data);
        setJoined(data.joined);
        setLoading(false);
      })
      .catch((err) => {
        showError("Failed to load event");
        setLoading(false);
      });
  }, [id]);

  // Show confirmation before joining
  const handleJoinClick = () => {
    setShowConfirmation(true);
  };

  // Confirm and join event
  const handleConfirmJoin = async () => {
    if (!event) return;
    setShowConfirmation(false);
    setJoining(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${window.API_BASE}/api/events/join/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      setJoined(true);
    } catch (error) {
      if (error.response) {
        showError(error.response.data.message || "Failed to join event");
      } else {
        showError("Failed to join the event.");
      }
    } finally {
      setJoining(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading event details...
      </div>
    );
  }

  // If event is not found
  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Event not found.
      </div>
    );
  }

  // Handle event date/time formatting
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatTime = (timeStr) => {
    if (!timeStr) return "No time available";
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date)) return timeStr;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formattedTime = formatTime(event.event_time);

  // Image URL
  const coverImage = event.event_image
    ? `${window.API_BASE}/uploads/events/${event.event_image}`
    : "/default-event.jpg";

  return (
    <div>
      <Navbar />

      {/* Cover photo */}
      <div
        className="relative w-full h-72 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text on top of cover */}
        <div className="absolute bottom-6 left-6 text-white space-y-2">
          <span className="bg-red-600 px-3 py-1 text-xs font-semibold rounded-md uppercase">
            {event.category_name}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            {event.title}
          </h1>

          <p className="text-sm flex items-center gap-2 opacity-90">
            <Calendar size={16} /> {formattedDate}
          </p>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="min-h-screen bg-gray-100 py-10 p-13">
        <section className="bg-gray-100 py-4 px-6 border-t border-[#d64553] ">
          <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200 gap-3 pb-8 mb-8">

            {/* Event Info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-700">
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                <Calendar size={14} /> {formattedDate}
              </span>

              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                <Clock size={14} /> {formattedTime}
              </span>

              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                <MapPin size={14} /> {event.location || "No location provided"}
              </span>

              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                {event.status || "Upcoming"}
              </span>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Join Now */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleJoinClick}
                disabled={joined || joining || !event?.allow_joining}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition
                  ${
                    !event?.allow_joining
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : joined
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                <ArrowRight size={16} />{" "}
                {!event?.allow_joining 
                  ? "Joining Disabled" 
                  : joined 
                  ? "Joined" 
                  : joining 
                  ? "Joining..." 
                  : "Join Now"}
              </button>
            </div>
            
            {!event?.allow_joining && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800"><strong>Note:</strong> Registration for this event is currently closed. Please try again later.</p>
              </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={showConfirmation}
              title="Join Event"
              message={`Are you sure you want to join "${event?.title}"?`}
              confirmText="Join"
              onConfirm={handleConfirmJoin}
              onCancel={() => setShowConfirmation(false)}
              isLoading={joining}
            />

            {/* Success Modal */}
            <SuccessModal
              isOpen={showSuccess}
              title="Successfully Joined"
              message={`You have successfully joined "${event?.title}".`}
              actionText="OK"
              autoCloseMs={2000}
              onClose={() => setShowSuccess(false)}
            />
          </div>

          {/* Other Sections */}
          <AboutEventCard event={event} />

          <CommentSection eventId={event.event_id} user={event.user} />

          <div className="mt-8">
            <EventDetailsSection event={event} />
          </div>

          {event.event_link && (
            <div className="mt-8 bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Event Link</h2>
              <a
                href={event.event_link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block text-red-600 hover:text-red-800 underline break-words"
              >
                {event.event_link}
              </a>
            </div>
          )}

          <div className="mt-8">
            <AttachmentFile event={event} />
          </div>
          <div className="mt-8">
            <OrganizerSection event={event} />
          </div>
        </section>
      </div>
    </div>
  );
}
