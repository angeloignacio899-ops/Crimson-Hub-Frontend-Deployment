import axios from "axios";

const SESSION_EXPIRED_EVENT = "auth:session-expired";
const AUTH_ENDPOINT_PATTERN =
  /(?:^|\/)(?:api\/)?auth\/(?:login|signup|verify-mfa-code|send-mfa-code|send-verification-code|forgot-password|reset-password|google\/signup)(?:\/|$)/i;

export function expireSession() {
  if (!localStorage.getItem("token")) return;

  localStorage.removeItem("token");
  localStorage.removeItem("role_id");
  localStorage.removeItem("userId");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

function isSessionExpiredResponse(status, url) {
  if (status !== 401) return false;
  if (!localStorage.getItem("token")) return false;

  const pathname = new URL(url, window.location.origin).pathname;
  return !AUTH_ENDPOINT_PATTERN.test(pathname);
}

export function setupSessionExpiryHandling() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    const request = input instanceof Request ? input : null;
    const url = request?.url || input;
    if (isSessionExpiredResponse(response.status, url)) {
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
          config?.url || ""
        )
      ) {
        expireSession();
      }

      return Promise.reject(error);
    }
  );
}

export { SESSION_EXPIRED_EVENT };
