/**
 * CalendarSubscribeModalM3 - MaterialM Design Version
 *
 * Material Design 3 implementation of the CalendarSubscribeModal component.
 * Uses MaterialM OKLCH color palette and M3 design patterns.
 *
 * Key differences from legacy:
 * - Uses MaterialM colors (bg-materialm-dark, text-materialm-text, etc.)
 * - Implements custom dialog overlay (M3 DialogM3 is lightweight)
 * - Uses ButtonM3 for all buttons
 * - Preserves all calendar subscription functionality
 * - Maintains accessibility (ARIA labels, focus states, keyboard navigation)
 * - Legacy colors replaced: 30+ instances
 */

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
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { tokens } from "../styles";
import { ButtonM3 } from "./m3/ButtonM3";

interface CalendarSubscribeModalM3Props {
  isOpen: boolean;
  onClose: () => void;
  currentShift?: Shift;
}

export function CalendarSubscribeModalM3({
  isOpen,
  onClose,
  currentShift,
}: CalendarSubscribeModalM3Props) {
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 ${tokens.spacing.card.md} animate-fade-in`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-subscribe-title"
    >
      <div
        ref={trapRef}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-materialm-dark border border-materialm-border-dark ${tokens.borders.radius.xl} shadow-materialm-5 animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between ${tokens.spacing.card.lg} border-b border-materialm-border-dark bg-materialm-darkgray`}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`p-2 bg-materialm-warning/20 ${tokens.borders.radius.md}`}>
              <Calendar className={`w-6 h-6 text-materialm-warning`} />
            </div>
            <div>
              <h2
                id="calendar-subscribe-title"
                className={`${tokens.typography.heading.h3} text-materialm-text-primary`}
              >
                Subscribe to Calendar
              </h2>
              <p
                className={`${tokens.typography.body.secondary} text-materialm-text-tertiary`}
              >
                Get hold schedules automatically in your calendar app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${tokens.touchTarget.min} ${tokens.borders.radius.md} text-materialm-text-tertiary hover:bg-materialm-surface-dark ${tokens.transitions.fast} flex items-center justify-center`}
            aria-label="Close calendar subscription modal"
          >
            <X className={`w-5 h-5`} />
          </button>
        </div>

        {/* Content */}
        <div className={`${tokens.spacing.card.lg} space-y-6`}>
          {/* How it works */}
          <div
            className={`${tokens.borders.radius.md} ${tokens.spacing.card.md} border border-materialm-primary/30 bg-materialm-primary/5`}
          >
            <h3 className={`font-semibold mb-3 text-materialm-text-primary`}>
              How it works
            </h3>
            <div className="space-y-2">
              {[
                "Your calendar app automatically updates with new holds",
                "No login or app installation required",
                "View holds alongside your personal appointments",
                "Works with Google Calendar, Apple Calendar, Outlook, and more",
              ].map((item, index) => (
                <div key={index} className={`flex items-start ${tokens.spacing.gap.sm}`}>
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 text-materialm-success`} />
                  <span className={`${tokens.typography.body.secondary} text-materialm-text-secondary`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Selector */}
          <div>
            <h3 className={`font-semibold mb-3 text-materialm-text-primary`}>
              Select Schedule
            </h3>
            <div className={`grid grid-cols-4 ${tokens.spacing.gap.sm}`}>
              {(["ALL", "A", "B", "C"] as const).map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`px-4 py-3 ${tokens.borders.radius.md} font-medium transition-all ${
                    selectedShift === shift
                      ? `bg-gradient-to-r from-materialm-warning to-materialm-secondary text-white ring-2 ring-materialm-warning/50 ring-offset-2 ring-offset-materialm-dark`
                      : `bg-materialm-surface-dark border border-materialm-border-dark text-materialm-text-secondary hover:border-materialm-border-light`
                  }`}
                >
                  {shift === "ALL" ? "All Shifts" : `Shift ${shift}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe Now */}
          <div>
            <h3 className={`font-semibold mb-3 text-materialm-text-primary`}>
              Subscribe Now
            </h3>

            {/* iPhone & iPad */}
            <div
              className={`mb-4 ${tokens.borders.radius.md} border border-materialm-border-dark bg-materialm-surface-dark`}
            >
              <div className={tokens.spacing.card.md}>
                <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
                  <Smartphone className={`w-5 h-5 text-materialm-success`} />
                  <h4 className={`font-semibold text-materialm-text-primary`}>
                    iPhone & iPad
                  </h4>
                </div>
                <ol
                  className={`space-y-2 ${tokens.typography.body.secondary} mb-4 text-materialm-text-secondary`}
                >
                  <li>1. Click the button below to open Settings</li>
                  <li>2. Tap "Subscribe" to confirm</li>
                  <li>3. The calendar will appear in your Calendar app</li>
                </ol>
                <a
                  href={webcalURL}
                  className={`inline-flex items-center ${tokens.spacing.gap.sm} px-4 py-2 bg-gradient-to-r from-materialm-success to-emerald-600 hover:from-materialm-success/90 hover:to-emerald-700 text-white ${tokens.borders.radius.md} font-medium transition-colors`}
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on iPhone/iPad
                </a>
              </div>
            </div>

            {/* Desktop */}
            <div
              className={`mb-4 ${tokens.borders.radius.md} border border-materialm-border-dark bg-materialm-surface-dark`}
            >
              <div className={tokens.spacing.card.md}>
                <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
                  <Monitor className={`w-5 h-5 text-materialm-primary`} />
                  <h4 className={`font-semibold text-materialm-text-primary`}>
                    Desktop (Mac/Windows)
                  </h4>
                </div>
                <ol
                  className={`space-y-2 ${tokens.typography.body.secondary} mb-4 text-materialm-text-secondary`}
                >
                  <li>
                    1. Click the button below to open your default calendar
                  </li>
                  <li>2. Confirm the subscription when prompted</li>
                </ol>
                <a
                  href={webcalURL}
                  className={`inline-flex items-center ${tokens.spacing.gap.sm} px-4 py-2 bg-gradient-to-r from-materialm-primary to-blue-600 hover:from-materialm-primary/90 hover:to-blue-700 text-white ${tokens.borders.radius.md} font-medium transition-colors`}
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on Desktop
                </a>
              </div>
            </div>

            {/* Google Calendar & Others */}
            <div
              className={`${tokens.borders.radius.md} border border-materialm-border-dark bg-materialm-surface-dark`}
            >
              <div className={tokens.spacing.card.md}>
                <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
                  <Globe className={`w-5 h-5 text-materialm-warning`} />
                  <h4 className={`font-semibold text-materialm-text-primary`}>
                    Google Calendar & Others
                  </h4>
                </div>
                <ol
                  className={`space-y-2 ${tokens.typography.body.secondary} mb-4 text-materialm-text-secondary`}
                >
                  <li>1. Copy the URL below</li>
                  <li>
                    2. In Google Calendar: Settings → Add calendar → From URL
                  </li>
                  <li>3. Paste the URL and click "Add calendar"</li>
                </ol>
                <div className={`flex ${tokens.spacing.gap.sm}`}>
                  <input
                    type="text"
                    value={subscriptionURL}
                    readOnly
                    className={`flex-1 px-3 py-2 ${tokens.borders.radius.md} border border-materialm-border-dark font-mono ${tokens.typography.body.secondary} bg-materialm-dark text-materialm-text-primary`}
                  />
                  <ButtonM3
                    onClick={handleCopy}
                    variant={copied ? "filled" : "outlined"}
                    color={copied ? "success" : "primary"}
                    size="md"
                    startIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? "Copied" : "Copy"}
                  </ButtonM3>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div
            className={`${tokens.borders.radius.md} ${tokens.spacing.card.md} border border-materialm-border-dark bg-materialm-surface-dark`}
          >
            <h3 className={`font-semibold mb-2 text-materialm-text-primary`}>
              Troubleshooting
            </h3>
            <ul
              className={`space-y-1 ${tokens.typography.body.secondary} text-materialm-text-tertiary`}
            >
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
