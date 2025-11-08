import { Lock, X, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { colors, tokens } from "../styles";
import { visualHeadings } from "../styles/visualHeadings";

interface BattalionChiefLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "Firerescue";

export function BattalionChiefLogin({ isOpen, onClose, onSuccess }: BattalionChiefLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trapRef = useFocusTrap(isOpen);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setError(null);
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (password === ADMIN_PASSWORD) {
      // Success - store admin status
      localStorage.setItem('battalionChiefAuth', 'true');
      setPassword("");
      setIsLoading(false);
      onSuccess();
      onClose();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${colors.components.modal.overlay}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="battalion-chief-login-title"
    >
      <div
        ref={trapRef}
        className={`relative w-full max-w-md mx-4 ${colors.components.modal.background} ${tokens.borders.radius.lg} ${colors.components.modal.shadow} overflow-hidden animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${tokens.spacing.card.lg} border-b ${colors.structural.border.default}`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`p-2 ${colors.semantic.warning.light} ${tokens.borders.radius.md}`}>
              <Lock className={`w-5 h-5 ${colors.semantic.warning.text}`} />
            </div>
            <h2
              id="battalion-chief-login-title"
              className={visualHeading('h3', colors.structural.text.primary)}
            >
              Battalion Chief Mode
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${tokens.touchTarget.min} ${colors.interactive.hover.bg} ${tokens.borders.radius.md} transition-colors flex items-center justify-center`}
            aria-label="Close login modal"
          >
            <X className={`w-5 h-5 ${colors.structural.text.secondary}`} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`mx-6 mt-6 ${tokens.spacing.card.md} ${colors.semantic.error.light} border ${colors.semantic.error.border} ${tokens.borders.radius.md} flex items-start ${tokens.spacing.gap.md}`}>
            <AlertCircle className={`w-5 h-5 ${colors.semantic.error.text} flex-shrink-0 mt-0.5`} />
            <p className={`${tokens.typography.body.secondary} ${colors.semantic.error.text}`}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={`${tokens.spacing.card.lg} space-y-4`}>
          <p className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>
            Enter password to enable Battalion Chief Mode and unlock admin features:
          </p>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className={`block ${tokens.typography.body.secondary} font-medium ${colors.structural.text.secondary} mb-2`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.structural.text.tertiary}`} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                autoFocus
                placeholder="Enter password"
                className={`w-full pl-10 pr-4 py-2.5 ${colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !password}
            className={`w-full py-3 px-4 ${colors.semantic.warning.gradient} ${colors.semantic.warning.hover} disabled:${colors.interactive.button.disabled} text-white font-medium ${tokens.borders.radius.md} transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className={`flex items-center justify-center ${tokens.spacing.gap.sm}`}>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Unlock Admin Features"
            )}
          </button>

          {/* Help Text */}
          <p className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary} text-center mt-4`}>
            Battalion Chief Mode allows managing roster, assigning holds, and overriding rotation.
          </p>
        </form>
      </div>
    </div>
  );
}
