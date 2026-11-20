import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const showNotification = useCallback((message, type, timeout) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setNotification({ message, type });
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        setNotification(null);
        timeoutRef.current = null;
      }, timeout);
    }
  }, []);

  const showError = useCallback(
    (message, timeout = 5000) => showNotification(message, "error", timeout),
    [showNotification]
  );

  const showSuccess = useCallback(
    (message, timeout = 5000) => showNotification(message, "success", timeout),
    [showNotification]
  );

  const clearError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setNotification(null);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <ErrorContext.Provider value={{ notification, showError, showSuccess, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
};
