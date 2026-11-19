import axios from "axios";

const SESSION_EXPIRED_EVENT = "auth:session-expired";
const AUTH_ENDPOINT_PATTERN =
  /(?:^|\/)(?:api\/)?auth\/(?:login|signup|verify-mfa-code|send-mfa-code|send-verification-code|forgot-password|reset-password|google\/signup)(?:\/|$)/i;

export function expireSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role_id");
  localStorage.removeItem("userId");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

function isSessionExpiredResponse(status, url, headers) {
  if (status !== 401) return false;

  const pathname = new URL(url, window.location.origin).pathname;
  if (AUTH_ENDPOINT_PATTERN.test(pathname)) return false;

  const authorization =
    headers?.get?.("Authorization") ??
    headers?.Authorization ??
    headers?.authorization;

  return (
    (typeof authorization === "string" && authorization.startsWith("Bearer ")) ||
    Boolean(localStorage.getItem("token")) ||
    Boolean(localStorage.getItem("role_id"))
  );
}

export function setupSessionExpiryHandling() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    const request = input instanceof Request ? input : null;
    const url = request?.url || input;
    const headers = init?.headers || request?.headers;

    if (isSessionExpiredResponse(response.status, url, headers)) {
      expireSession();
    }

    return response;
  };

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const response = error.response;
      const config = response?.config || error.config;

      if (
        response &&
        isSessionExpiredResponse(
          response.status,
          config?.url || "",
          config?.headers
        )
      ) {
        expireSession();
      }

      return Promise.reject(error);
    }
  );
}

export { SESSION_EXPIRED_EVENT };
