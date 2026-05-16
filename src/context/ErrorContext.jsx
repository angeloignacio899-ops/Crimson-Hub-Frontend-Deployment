import React, { createContext, useContext, useState, useCallback } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = useCallback((message, timeout = 5000) => {
    setError(message);
    if (timeout > 0) {
      setTimeout(() => setError(null), timeout);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
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
