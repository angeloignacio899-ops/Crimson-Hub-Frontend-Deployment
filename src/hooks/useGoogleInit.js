import { useEffect } from 'react';

let googleInitialized = false;
let callbackRegistry = {};

export const useGoogleInit = (componentId, callback) => {
  useEffect(() => {
    // Only initialize once globally
    if (!googleInitialized && window.google) {
      // Global callback dispatcher
      const globalCallback = (response) => {
        // Find and call the appropriate callback
        Object.values(callbackRegistry).forEach(cb => {
          if (cb) cb(response);
        });
      };

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: globalCallback,
      });
      googleInitialized = true;
      console.log('✅ Google Identity Services initialized (global)');
    }

    // Register this component's callback
    if (componentId && callback) {
      callbackRegistry[componentId] = callback;
    }

    // Cleanup: unregister callback on unmount
    return () => {
      if (componentId) {
        delete callbackRegistry[componentId];
      }
    };
  }, [componentId, callback]);
};
