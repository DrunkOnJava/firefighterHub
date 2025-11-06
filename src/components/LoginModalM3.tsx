/**
 * LoginModalM3 - MaterialM Design 3 Login Modal
 *
 * Material Design 3 version of LoginModal using:
 * - DialogM3 for modal container
 * - InputM3 for form inputs
 * - ButtonM3 for action buttons
 * - MaterialM color palette
 *
 * Preserves all authentication logic from original LoginModal.
 *
 * @example
 * ```tsx
 * <LoginModalM3
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSuccess={handleSuccess}
 * />
 * ```
 */

import { AlertCircle, Lock, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { colors } from "../styles";
import { DialogM3 } from "./m3/DialogM3";
import { InputM3 } from "./m3/InputM3";
import { ButtonM3 } from "./m3/ButtonM3";

interface LoginModalM3Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModalM3({ isOpen, onClose, onSuccess }: LoginModalM3Props) {
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

  return (
    <DialogM3
      show={isOpen}
      onClose={onClose}
      title="Admin Sign In"
      size="md"
      dismissible={true}
    >
      <div ref={trapRef}>
        <DialogM3.Body>
          {/* Error Alert */}
          {error && (
            <div className={`mb-6 p-4 ${colors.semantic.error.light} border ${colors.semantic.error.border} rounded-lg flex items-start gap-3`}>
              <AlertCircle className={`w-5 h-5 ${colors.semantic.error.text} flex-shrink-0 mt-0.5`} />
              <p className={`text-sm ${colors.semantic.error.text}`}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <InputM3
              label="Email Address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              startIcon={<Mail className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
              error={error ? "" : undefined}
            />

            {/* Password Field */}
            <InputM3
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              startIcon={<Lock className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
              error={error ? "" : undefined}
            />

            {/* Help Text */}
            <p className={`text-sm text-center ${colors.structural.text.tertiary}`}>
              Only authorized administrators can sign in.
            </p>

            {/* Submit Button */}
            <ButtonM3
              type="submit"
              variant="filled"
              color="primary"
              fullWidth
              disabled={isLoading || !email || !password}
              loading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </ButtonM3>
          </form>
        </DialogM3.Body>
      </div>
    </DialogM3>
  );
}
