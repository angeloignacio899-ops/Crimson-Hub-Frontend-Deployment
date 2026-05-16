import React from "react";
import { Send, Link } from "lucide-react";

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.185-1.333h2.815v-3h-3c-4.523 0-5 2.155-5 5.278v1.722z" />
  </svg>
);

const ShareEvent = () => {
  const buttonStyle =
    "flex flex-col items-center justify-center p-4 sm:p-5 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150 cursor-pointer";
  const labelStyle = "text-gray-700 text-sm font-medium mt-2 text-center";

  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Share This Event
      </h2>

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className={buttonStyle}>
            <FacebookIcon />
            <span className={labelStyle}>Facebook</span>
          </div>

          <div className={buttonStyle}>
            <Send className="text-sky-500" />
            <span className={labelStyle}>Telegram</span>
          </div>

          <div className={buttonStyle}>
            <Link className="text-gray-700" />
            <span className={labelStyle}>Copy Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEvent;
