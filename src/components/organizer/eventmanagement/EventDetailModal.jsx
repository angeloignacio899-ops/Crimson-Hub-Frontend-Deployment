import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const EventDetailModal = ({ eventId, onClose }) => {
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------------- FETCH EVENT ---------------- */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${window.API_BASE}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  /* ---------------- FETCH COMMENTS ---------------- */
  useEffect(() => {
    if (!eventId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${window.API_BASE}/api/comments/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    fetchComments();
  }, [eventId]);

  /* ---------------- SUBMIT COMMENT / REPLY ---------------- */
  const submitComment = async () => {
    if (!text.trim()) return;

    try {
      await fetch(window.API_BASE + "/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: eventId,
          parent_id: replyTo,
          content: text
        })
      });

      setText("");
      setReplyTo(null);

      const res = await fetch(
        `${window.API_BASE}/api/comments/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(await res.json());
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const rootComments = comments.filter(c => c.parent_id === null);
  const replies = id => comments.filter(c => c.parent_id === id);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-10 space-y-6">

          {/* Image */}
          <div className="w-full h-60 rounded-xl overflow-hidden bg-gray-200">
            {event.event_image ? (
              <img
                src={`${window.API_BASE}/uploads/events/${event.event_image}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Info */}
          <h1 className="text-3xl font-bold">{event.title}</h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <strong className="text-gray-700">Category:</strong>
              <p className="text-gray-600">{event.category_name || event.category || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Organizer:</strong>
              <p className="text-gray-600">{event.organizer_name || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Date:</strong>
              <p className="text-gray-600">{event.event_date ? new Date(event.event_date).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Time:</strong>
              <p className="text-gray-600">{event.event_time || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Location:</strong>
              <p className="text-gray-600">{event.location || "N/A"}</p>
            </div>
            <div>
              <strong className="text-gray-700">Status:</strong>
              <p className="text-gray-600">{event.status || event.approval_status || "N/A"}</p>
            </div>
          </div>

          <div>
            <strong>Description:</strong>
            <p className="whitespace-pre-line mt-1">{event.description}</p>
          </div>

          {/* ---------------- COMMENT SECTION ---------------- */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            {/* USER COMMENT INPUT */}
            {user?.role === "user" && !replyTo && (
              <>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border rounded-lg p-3 mb-2"
                />
                <button
                  onClick={submitComment}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Post Comment
                </button>
              </>
            )}

            {/* COMMENT LIST */}
            <div className="mt-6 space-y-4">
              {rootComments.map(comment => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <p className="font-semibold">
                    {comment.name}
                    <span className="text-xs text-gray-500 ml-2">
                      ({comment.role_name})
                    </span>
                  </p>
                  <p className="text-gray-700 mt-1">{comment.content}</p>

                  {/* Organizer/Admin Reply Button */}
                  {(user?.role === "organizer" || user?.role === "admin") && (
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-sm text-red-600 mt-2"
                    >
                      Reply
                    </button>
                  )}

                  {/* Reply box */}
                  {replyTo === comment.id && (
                    <div className="mt-3">
                      <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full border rounded-lg p-2"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={submitComment}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setText("");
                          }}
                          className="text-sm text-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  <div className="ml-6 mt-4 space-y-2">
                    {replies(comment.id).map(reply => (
                      <div
                        key={reply.id}
                        className="bg-gray-100 p-3 rounded-lg"
                      >
                        <p className="text-sm font-semibold">
                          {reply.name} ({reply.role_name})
                        </p>
                        <p className="text-sm text-gray-700">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {rootComments.length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>
          </div>
          {/* ---------------- END COMMENTS ---------------- */}

        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
