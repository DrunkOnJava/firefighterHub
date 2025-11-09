import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * UpdateNotification Component
 *
 * Detects when a new service worker version is available and prompts
 * users to reload the page to get the latest updates.
 *
 * This solves the cache issue by:
 * 1. Detecting when a new service worker is waiting
 * 2. Showing a prominent notification to users
 * 3. Allowing one-click reload to activate the new version
 */
export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Check for updates every 60 seconds
    const checkForUpdates = () => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.update();
      });
    };

    const interval = setInterval(checkForUpdates, 60000);

    // Listen for new service worker waiting
    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      // Check if there's already a waiting service worker
      if (reg.waiting) {
        setShowUpdate(true);
      }

      // Listen for new service worker installed
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker is waiting
            setShowUpdate(true);
          }
        });
      });
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    if (!registration?.waiting) return;

    // Tell the waiting service worker to activate
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-lg shadow-2xl border border-amber-500/50 max-w-md">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">New Update Available!</p>
            <p className="text-sm text-orange-100 mt-1">
              Click reload to get the latest features and fixes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-white text-amber-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-orange-50 transition-colors"
            >
              Reload
            </button>
            <button
              onClick={() => setShowUpdate(false)}
              className="p-2 hover:bg-orange-700 rounded-md transition-colors"
              aria-label="Dismiss update notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
