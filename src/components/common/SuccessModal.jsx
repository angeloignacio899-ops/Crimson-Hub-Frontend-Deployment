import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function SuccessModal({
  isOpen,
  title,
  message,
  actionText = "Done",
  autoCloseMs = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return;

    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg">

        {/* Green top accent bar */}
        <div className="h-1 bg-green-600" />

        {/* Body */}
        <div className="px-6 pt-7 pb-6">

          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mb-4">
            <CheckCircle size={24} className="text-green-600" />
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {message}
          </p>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-lg bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-bold transition-all"
            >
              {actionText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
