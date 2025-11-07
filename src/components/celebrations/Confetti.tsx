/**
 * Confetti Component
 * 
 * Canvas-based confetti particle system with physics simulation.
 * 
 * Features:
 * - Realistic physics (gravity, wind, rotation)
 * - Configurable colors, count, spread
 * - Auto-cleanup after animation
 * - Respects prefers-reduced-motion
 * - Performance optimized (RAF loop)
 * 
 * Usage:
 * ```tsx
 * const [showConfetti, setShowConfetti] = useState(false);
 * 
 * <Confetti
 *   active={showConfetti}
 *   onComplete={() => setShowConfetti(false)}
 *   particleCount={100}
 *   colors={['#FF6B6B', '#4ECDC4']}
 * />
 * ```
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  createConfettiParticles,
  updateParticle,
  isParticleActive,
  drawParticle,
  type ConfettiParticle,
  type ConfettiConfig,
} from '../../utils/confettiPhysics';

interface ConfettiProps extends ConfettiConfig {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

export function Confetti({
  active,
  onComplete,
  duration = 3000,
  className = '',
  ...config
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      // Clean up if motion is reduced
      if (prefersReducedMotion && active) {
        // Still call onComplete for reduced motion users
        const timer = setTimeout(() => {
          onComplete?.();
        }, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    particlesRef.current = createConfettiParticles(
      canvas.width,
      canvas.height,
      config
    );
    startTimeRef.current = Date.now();
    setIsAnimating(true);

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      const elapsed = Date.now() - (startTimeRef.current || 0);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current
        .map((p) => updateParticle(p, config))
        .filter((p) => isParticleActive(p, canvas.height));

      particlesRef.current.forEach((p) => drawParticle(ctx, p));

      // Continue animation or complete
      if (particlesRef.current.length > 0 && elapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current = [];
      setIsAnimating(false);
    };
  }, [active, duration, config, onComplete, prefersReducedMotion]);

  if (!active || prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`
        fixed inset-0 pointer-events-none z-[9999]
        ${isAnimating ? 'block' : 'hidden'}
        ${className}
      `}
      aria-hidden="true"
    />
  );
}

/**
 * ConfettiButton Component
 * Button that triggers confetti on click
 */
interface ConfettiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  confettiConfig?: ConfettiConfig;
  className?: string;
  disabled?: boolean;
}

export function ConfettiButton({
  children,
  onClick,
  confettiConfig,
  className = '',
  disabled = false,
}: ConfettiButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setShowConfetti(true);
    onClick?.();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>

      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        {...confettiConfig}
      />
    </>
  );
}
