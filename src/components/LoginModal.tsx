import { AlertCircle, Lock, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { colors, tokens, visualHeadings } from "../styles";
import { Button } from "./ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trapRef = useFocusTrap(isOpen);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useFocusReturn(isOpen);

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

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before signing in.");
        } else {
          setError(error.message || "Failed to sign in. Please try again.");
        }
        setIsLoading(false);
      } else {
        // Success
        setEmail("");
        setPassword("");
        onSuccess?.();
        onClose();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
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
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${colors.components.modal.overlay}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        ref={trapRef}
        className={`relative w-full h-full sm:h-auto sm:max-w-md sm:mx-4 max-h-screen sm:max-h-[90vh] ${colors.components.modal.background} sm:${tokens.borders.radius.lg} ${colors.components.modal.shadow} overflow-y-auto animate-slide-up sm:animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${tokens.spacing.card.lg} border-b ${colors.structural.border.default}`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`p-2 ${colors.semantic.warning.light} ${tokens.borders.radius.md}`}>
              <Lock className={`w-5 h-5 ${colors.semantic.warning.text}`} />
            </div>
            <h2
              id="login-modal-title"
              className={`${visualHeadings.subtitleLarge} ${colors.structural.text.primary}`}
            >
              Battalion Chief Sign In
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
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block ${tokens.typography.body.secondary} font-medium ${colors.structural.text.secondary} mb-2`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.structural.text.tertiary}`} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className={`w-full pl-10 pr-4 py-2.5 ${colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                disabled={isLoading}
              />
            </div>
          </div>

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
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2.5 ${colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!email || !password}
            state={isLoading ? 'loading' : 'idle'}
            variant="default"
            size="lg"
            fullWidth
            withRipple
          >
            Sign In
          </Button>

          {/* Help Text */}
          <p className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary} text-center mt-4`}>
            Only authorized Battalion Chiefs can access admin features.
          </p>
        </form>
      </div>
    </div>
  );
}
