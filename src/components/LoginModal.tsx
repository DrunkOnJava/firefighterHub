import { AlertCircle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setError(null);
      setPassword("");
      onClose();
    }
  };

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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
              <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Battalion Chief Sign In
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground text-center">
            Only authorized Battalion Chiefs can access admin features.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
