import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { colors, tokens } from "../styles";
import { ButtonM3 } from "./m3/ButtonM3";
import { IconButtonM3 } from "./m3/ButtonM3";

/**
 * UpdateNotificationM3 Component (MaterialM Version)
 *
 * Detects when a new service worker version is available and prompts
 * users to reload the page to get the latest updates.
 *
 * This solves the cache issue by:
 * 1. Detecting when a new service worker is waiting
 * 2. Showing a prominent notification to users
 * 3. Allowing one-click reload to activate the new version
 *
 * MaterialM Design:
 * - Uses info color for general updates and warning for critical updates
 * - ButtonM3 for consistent button styling
 * - MaterialM semantic color system for backgrounds and text
 */
export function UpdateNotificationM3() {
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
      <div className={`${colors.semantic.info.solid} text-white ${tokens.spacing.card.lg} ${tokens.borders.radius.lg} shadow-2xl border ${colors.semantic.info.border} max-w-md`}>
        <div className={`flex items-center ${tokens.spacing.gap.md}`}>
          <RefreshCw className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className={`font-semibold ${tokens.typography.body.secondary}`}>New Update Available!</p>
            <p className={`${tokens.typography.body.small} text-materialm-info-light mt-1`}>
              Click reload to get the latest features and fixes
            </p>
          </div>
          <div className={`flex ${tokens.spacing.gap.sm}`}>
            <ButtonM3
              variant="filled"
              color="info"
              size="sm"
              onClick={handleUpdate}
              className="whitespace-nowrap"
            >
              Reload
            </ButtonM3>
            <IconButtonM3
              variant="text"
              color="info"
              size="sm"
              onClick={() => setShowUpdate(false)}
              aria-label="Dismiss update notification"
            >
              <X className="w-4 h-4" />
            </IconButtonM3>
          </div>
        </div>
      </div>
    </div>
  );
}
