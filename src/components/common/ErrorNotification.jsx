import React from "react";
import { AlertCircle, X } from "lucide-react";
import { useError } from "../../context/ErrorContext";

const ErrorNotification = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm z-50 animate-slide-in-right">
      <div className="bg-red-50 border-l-4 border-red-600 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">Error</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={clearError}
          className="text-red-600 hover:text-red-800 flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
