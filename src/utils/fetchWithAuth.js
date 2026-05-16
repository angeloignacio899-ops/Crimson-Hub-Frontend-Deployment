// src/utils/fetchWithAuth.js

/**
 * Fetch wrapper with authentication token and response validation
 * Throws user-friendly error messages for HTTP errors
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // ❌ HTTP error status codes
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const data = await response.json();
      errorMessage = data.message || data.msg || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    // Handle specific status codes
    if (response.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("Access denied. You don't have permission.");
    }

    if (response.status === 404) {
      throw new Error("Resource not found.");
    }

    if (response.status === 422) {
      throw new Error(`Validation error: ${errorMessage}`);
    }

    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    throw new Error(errorMessage);
  }

  return response;
};
