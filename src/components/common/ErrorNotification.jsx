import React from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useError } from "../../context/ErrorContext";

const ErrorNotification = () => {
  const { notification, clearError } = useError();

  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const styles = isSuccess
    ? {
        container: "bg-green-50 border-green-600",
        icon: "text-green-600",
        title: "text-green-800",
        message: "text-green-700",
        close: "text-green-600 hover:text-green-800",
      }
    : {
        container: "bg-red-50 border-red-600",
        icon: "text-red-600",
        title: "text-red-800",
        message: "text-red-700",
        close: "text-red-600 hover:text-red-800",
      };

  return (
    <div className="fixed top-4 right-4 max-w-sm z-50 animate-slide-in-right">
      <div className={`${styles.container} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3`}>
        <Icon className={`${styles.icon} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.title}`}>
            {isSuccess ? "Success" : "Error"}
          </h3>
          <p className={`${styles.message} text-sm mt-1`}>{notification.message}</p>
        </div>
        <button
          onClick={clearError}
          className={`${styles.close} flex-shrink-0`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
