import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  title = "Confirm Action", 
  message = "Are you sure?",
  confirmText = "Confirm", 
  cancelText = "Cancel",
  isDangerous = false, 
  isLoading = false,
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg">

        {/* Red top accent bar */}
        <div className={`h-1 ${isDangerous ? "bg-red-600" : "bg-red-600"}`} />

        {/* Body */}
        <div className="px-6 pt-7 pb-6">

          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
            isDangerous 
              ? "bg-red-50 border border-red-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <AlertCircle size={24} className={isDangerous ? "text-red-600" : "text-red-600"} />
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-[2] py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}