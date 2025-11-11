import {
  Calendar,
  Check,
  Copy,
  Globe,
  Monitor,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFocusReturn } from '@/hooks/useFocusReturn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Shift } from '@/lib/supabase';
import { IconButton } from '@/components/ui/IconButton';

interface CalendarSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift?: Shift;
}

export function CalendarSubscribeModal({
  isOpen,
  onClose,
  currentShift,
}: CalendarSubscribeModalProps) {
  const [selectedShift, setSelectedShift] = useState<Shift | "ALL">(
    currentShift || "ALL"
  );
  const [copied, setCopied] = useState(false);
  const trapRef = useFocusTrap(isOpen);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setSelectedShift(currentShift || "ALL");
    }
  }, [isOpen, currentShift]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate calendar subscription URL
  const baseURL = window.location.origin;
  const shiftParam = selectedShift === "ALL" ? "" : `?shift=${selectedShift}`;
  const subscriptionURL = `${baseURL}/api/calendar/hold-schedule.ics${shiftParam}`;
  const webcalURL = subscriptionURL.replace(/^https:\/\//, "webcal://");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-subscribe-title"
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-scale-in bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-muted border-border">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-warning/20 dark:bg-warning/20 rounded-md">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h2
                id="calendar-subscribe-title"
                className="text-2xl font-bold text-foreground"
              >
                Subscribe to Calendar
              </h2>
              <p className="text-sm text-muted-foreground">
                Get hold schedules automatically in your calendar app
              </p>
            </div>
          </div>
          <IconButton
            icon={X}
            label="Close calendar subscription modal"
            onClick={onClose}
            variant="default"
            size="md"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* How it works */}
          <div className="rounded-md p-4 border bg-primary/10 dark:bg-primary/10 border-primary/30">
            <h3 className="font-semibold mb-3 text-foreground">
              How it works
            </h3>
            <div className="space-y-2">
              {[
                "Your calendar app automatically updates with new holds",
                "No login or app installation required",
                "View holds alongside your personal appointments",
                "Works with Google Calendar, Apple Calendar, Outlook, and more",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Selector */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Select Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(["ALL", "A", "B", "C"] as const).map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`px-4 py-3 rounded-md font-medium transition-all ${
                    selectedShift === shift
                      ? "bg-warning text-warning-foreground ring-2 ring-warning ring-offset-2 ring-offset-background"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {shift === "ALL" ? "All Shifts" : `Shift ${shift}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe Now */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Subscribe Now
            </h3>

            {/* iPhone & iPad */}
            <div className="mb-4 rounded-md border bg-muted border-border">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-foreground">
                    iPhone & iPad
                  </h4>
                </div>
                <ol className="space-y-2 text-sm mb-4 text-muted-foreground">
                  <li>1. Click the button below to open Settings</li>
                  <li>2. Tap "Subscribe" to confirm</li>
                  <li>3. The calendar will appear in your Calendar app</li>
                </ol>
                <a
                  href={webcalURL}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/90 text-success-foreground rounded-md font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on iPhone/iPad
                </a>
              </div>
            </div>

            {/* Desktop */}
            <div className="mb-4 rounded-md border bg-muted border-border">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-foreground">
                    Desktop (Mac/Windows)
                  </h4>
                </div>
                <ol className="space-y-2 text-sm mb-4 text-muted-foreground">
                  <li>
                    1. Click the button below to open your default calendar
                  </li>
                  <li>2. Confirm the subscription when prompted</li>
                </ol>
                <a
                  href={webcalURL}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on Desktop
                </a>
              </div>
            </div>

            {/* Google Calendar & Others */}
            <div className="rounded-md border bg-muted border-border">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-foreground">
                    Google Calendar & Others
                  </h4>
                </div>
                <ol className="space-y-2 text-sm mb-4 text-muted-foreground">
                  <li>1. Copy the URL below</li>
                  <li>
                    2. In Google Calendar: Settings → Add calendar → From URL
                  </li>
                  <li>3. Paste the URL and click "Add calendar"</li>
                </ol>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subscriptionURL}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-md border font-mono text-sm bg-input border-input text-foreground"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                      copied
                        ? "bg-success text-success-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="rounded-md p-4 border bg-muted border-border">
            <h3 className="font-semibold mb-2 text-foreground">
              Troubleshooting
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Calendar updates every 30 minutes automatically</li>
              <li>
                • If events don't appear, check your calendar app's subscribed
                calendars list
              </li>
              <li>
                • To unsubscribe, remove the calendar from your calendar app
                settings
              </li>
              <li>• Android users: Use the Google Calendar method above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
