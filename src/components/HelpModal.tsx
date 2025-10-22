import { X, Calendar, Users, CheckCircle, TrendingUp, Trash2, Lock, Unlock } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { useEffect, useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMasterReset: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: (password: string) => boolean;
}

export function HelpModal({ isOpen, onClose, onMasterReset, isAdminMode, onToggleAdminMode }: HelpModalProps) {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPasswordPrompt) {
          setShowPasswordPrompt(false);
          setPassword('');
          setPasswordError(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showPasswordPrompt]);

  useEffect(() => {
    if (!isOpen) {
      setShowPasswordPrompt(false);
      setPassword('');
      setPasswordError(false);
    }
  }, [isOpen]);

  function handleAdminToggle() {
    if (isAdminMode) {
      onToggleAdminMode('');
      setShowPasswordPrompt(false);
    } else {
      setShowPasswordPrompt(true);
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = onToggleAdminMode(password);
    if (success) {
      setShowPasswordPrompt(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-6 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Calendar className="text-white" size={24} />
            </div>
            <h2 id="help-modal-title" className="text-2xl font-bold text-white">How to Use Hold List Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close help dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6 pb-8">
            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">Calendar Management</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Schedule holds:</strong> Click any future date on the calendar to assign a firefighter</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>View details:</strong> Click on scheduled holds to view or modify them</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Navigate months:</strong> Use arrow buttons or "Today" button to navigate</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Color coding:</strong> Blue = scheduled, Green = completed, Ring = today</span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Firefighter Management</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span><strong>Add firefighters:</strong> Click "Add Team Member" button and enter name and station</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span><strong>Rotation order:</strong> Firefighters automatically rotate based on their position</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span><strong>Next in line:</strong> The next firefighter is highlighted with "NEXT FOR HOLD" badge</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 font-bold">•</span>
                  <span><strong>On/Off duty:</strong> Toggle availability status - off-duty members skip rotation</span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-orange-400" size={24} />
                <h3 className="text-xl font-bold text-white">Completing Holds</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span><strong>Complete hold:</strong> Click "Complete Hold" button on firefighter card</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span><strong>Auto-update:</strong> Calendar and scheduled holds update automatically</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span><strong>Rotation:</strong> Firefighter moves to bottom of rotation after completing hold</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-bold">•</span>
                  <span><strong>History:</strong> Last hold date is tracked for each firefighter</span>
                </li>
              </ul>
            </section>

            <section className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">Sidebar Features</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong>Overview:</strong> See total, on-duty, and off-duty firefighter counts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong>Upcoming holds:</strong> View next 7 scheduled holds at a glance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong>Rotation order:</strong> See who's next in line for holds</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 font-bold">•</span>
                  <span><strong>Real-time sync:</strong> All updates happen instantly across the app</span>
                </li>
              </ul>
            </section>

            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• The system automatically maintains fair rotation by tracking each firefighter's position</li>
                <li>• Hold dates can't be double-booked - only one firefighter per day</li>
                <li>• All changes sync in real-time using Supabase database</li>
                <li>• Activity log tracks all actions for accountability</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border-2 border-yellow-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                {isAdminMode ? <Unlock className="text-yellow-400" size={24} /> : <Lock className="text-yellow-400" size={24} />}
                <h3 className="text-lg font-bold text-yellow-300">Admin Mode</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {isAdminMode
                  ? 'Admin mode is currently enabled. You can edit and manage all data.'
                  : 'Enable admin mode to edit and manage firefighters, schedules, and settings.'}
              </p>
              <button
                onClick={handleAdminToggle}
                className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isAdminMode
                    ? 'bg-yellow-900/50 hover:bg-yellow-800/70 border-2 border-yellow-600 text-yellow-200'
                    : 'bg-yellow-900/50 hover:bg-yellow-800/70 border-2 border-yellow-600 text-yellow-200'
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Unlock size={20} />
                    Disable Admin Mode
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Enable Admin Mode
                  </>
                )}
              </button>
            </div>

            {isAdminMode && (
              <div className="bg-red-900/20 border-2 border-red-700 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="text-red-400" size={24} />
                  <h3 className="text-lg font-bold text-red-300">Danger Zone</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Use this button to completely reset the system and start fresh. This will permanently delete all firefighters, holds, and history from all shifts.
                </p>
                <button
                  onClick={() => {
                    onMasterReset();
                    onClose();
                  }}
                  className="w-full bg-red-900/50 hover:bg-red-800/70 border-2 border-red-600 text-red-200 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Master Reset - Delete Everything
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-gray-700 p-5 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
          >
            Got It!
          </button>
        </div>

        {showPasswordPrompt && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPasswordPrompt(false);
                setPassword('');
                setPasswordError(false);
              }
            }}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-yellow-600 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-yellow-400" size={28} />
                <h3 className="text-xl font-bold text-white">Enter Admin Password</h3>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Enter password"
                    autoFocus
                    className={`w-full px-4 py-3 bg-gray-900 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-red-600 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-yellow-500'
                    }`}
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-2">Incorrect password. Please try again.</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPassword('');
                      setPasswordError(false);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
