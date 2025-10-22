import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Smartphone, Monitor, Globe, Copy, Check } from 'lucide-react';
import { Shift } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';

interface CalendarSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift?: Shift;
  isDarkMode?: boolean;
}

export function CalendarSubscribeModal({
  isOpen,
  onClose,
  currentShift,
  isDarkMode = true
}: CalendarSubscribeModalProps) {
  const [selectedShift, setSelectedShift] = useState<Shift | 'ALL'>(currentShift || 'ALL');
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useFocusTrap(modalRef, isOpen);
  useFocusReturn(triggerElementRef, isOpen);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setSelectedShift(currentShift || 'ALL');
    }
  }, [isOpen, currentShift]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate calendar subscription URL
  const baseURL = window.location.origin;
  const shiftParam = selectedShift === 'ALL' ? '' : `?shift=${selectedShift}`;
  const subscriptionURL = `${baseURL}/api/calendar/hold-schedule.ics${shiftParam}`;
  const webcalURL = subscriptionURL.replace(/^https:\/\//, 'webcal://');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-subscribe-title"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-scale-in ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 id="calendar-subscribe-title" className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Subscribe to Calendar
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Get hold schedules automatically in your calendar app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'
            }`}
            aria-label="Close calendar subscription modal"
          >
            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* How it works */}
          <div className={`rounded-lg p-4 border ${
            isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              How it works
            </h3>
            <div className="space-y-2">
              {[
                'Your calendar app automatically updates with new holds',
                'No login or app installation required',
                'View holds alongside your personal appointments',
                'Works with Google Calendar, Apple Calendar, Outlook, and more'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Selector */}
          <div>
            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Select Schedule
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(['ALL', 'A', 'B', 'C'] as const).map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedShift === shift
                      ? 'bg-orange-500 text-white ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-800'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {shift === 'ALL' ? 'All Shifts' : `Shift ${shift}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe Now */}
          <div>
            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Subscribe Now
            </h3>

            {/* iPhone & iPad */}
            <div className={`mb-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    iPhone & iPad
                  </h4>
                </div>
                <ol className={`space-y-2 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  <li>1. Click the button below to open Settings</li>
                  <li>2. Tap "Subscribe" to confirm</li>
                  <li>3. The calendar will appear in your Calendar app</li>
                </ol>
                <a
                  href={webcalURL}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on iPhone/iPad
                </a>
              </div>
            </div>

            {/* Desktop */}
            <div className={`mb-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Desktop (Mac/Windows)
                  </h4>
                </div>
                <ol className={`space-y-2 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  <li>1. Click the button below to open your default calendar</li>
                  <li>2. Confirm the subscription when prompted</li>
                </ol>
                <a
                  href={webcalURL}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Subscribe on Desktop
                </a>
              </div>
            </div>

            {/* Google Calendar & Others */}
            <div className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Google Calendar & Others
                  </h4>
                </div>
                <ol className={`space-y-2 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  <li>1. Copy the URL below</li>
                  <li>2. In Google Calendar: Settings → Add calendar → From URL</li>
                  <li>3. Paste the URL and click "Add calendar"</li>
                </ol>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subscriptionURL}
                    readOnly
                    className={`flex-1 px-3 py-2 rounded-lg border font-mono text-sm ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-300'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
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
          <div className={`rounded-lg p-4 border ${
            isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Troubleshooting
            </h3>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              <li>• Calendar updates every 30 minutes automatically</li>
              <li>• If events don't appear, check your calendar app's subscribed calendars list</li>
              <li>• To unsubscribe, remove the calendar from your calendar app settings</li>
              <li>• Android users: Use the Google Calendar method above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
