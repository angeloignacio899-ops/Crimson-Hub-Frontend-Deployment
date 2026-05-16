import { useEffect, useState } from "react";
import { useError } from "../../context/ErrorContext";

export default function CommentSection({ eventId, user }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const token = localStorage.getItem("token");
  const { showError } = useError();

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${window.API_BASE}/api/comments/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setComments(data);
    } catch (err) {
      showError("Failed to load comments");
    }
  };

  const submitComment = async () => {
    if (!content.trim()) return;

    try {
      await fetch(`${window.API_BASE}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          parent_id: replyTo,
          content,
        }),
      });

      setContent("");
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      showError("Failed to post comment");
      console.error("Failed to post comment", err);
    }
  };

  const rootComments = comments.filter((c) => c.parent_id === null);
  const replies = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <div className="bg-white mt-8 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-600 hover:text-red-700 text-2xl focus:outline-none transition-transform"
        >
          {isExpanded ? "▼" : "▶"}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Comment input */}
          <textarea
            placeholder={
              replyTo ? "Write a reply..." : "Write a comment..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-3 mb-2 focus:ring focus:ring-red-200"
          />

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={submitComment}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>

            {replyTo && (
              <button
                onClick={() => setReplyTo(null)}
                className="text-sm text-gray-500"
              >
                Cancel reply
              </button>
            )}
          </div>

          {/* Comments list */}
          <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
            {rootComments.length === 0 && (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}

            {rootComments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <p className="font-semibold">{comment.name}</p>
                <p className="text-gray-700 mt-1">{comment.content}</p>

                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-sm text-red-600 mt-2"
                >
                  Reply
                </button>

                {/* Replies */}
                <div className="ml-6 mt-4 space-y-3">
                  {replies(comment.id).map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-gray-100 p-3 rounded-lg"
                    >
                      <p className="font-semibold text-sm">
                        {reply.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
