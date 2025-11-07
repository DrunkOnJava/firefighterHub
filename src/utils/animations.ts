/**
 * Animation Utilities
 * 
 * Reusable animation functions, timing constants, and easing curves.
 */

import { useReducedMotion } from '../hooks/useReducedMotion';

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

export const DURATIONS = {
  instant: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  verySlow: 500,
} as const;

export const EASING = {
  // Standard easing curves
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Custom easing curves
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth acceleration/deceleration
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)', // Sharp entrance/exit
  
  // Material Design
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  deceleration: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  acceleration: 'cubic-bezier(0.4, 0.0, 1, 1)',
} as const;

export const SCALES = {
  subtle: 0.98,
  moderate: 0.95,
  expressive: 0.92,
} as const;

// ============================================================================
// COMMON ANIMATIONS
// ============================================================================

/**
 * Fade in animation
 */
export const fadeIn = (duration: number = DURATIONS.normal) => ({
  keyframes: [
    { opacity: 0 },
    { opacity: 1 },
  ],
  duration,
  easing: EASING.easeOut,
  fill: 'forwards' as FillMode,
});

/**
 * Fade out animation
 */
export const fadeOut = (duration: number = DURATIONS.normal) => ({
  keyframes: [
    { opacity: 1 },
    { opacity: 0 },
  ],
  duration,
  easing: EASING.easeIn,
  fill: 'forwards' as FillMode,
});

/**
 * Slide in from direction
 */
export const slideIn = (
  direction: 'top' | 'right' | 'bottom' | 'left',
  distance: number = 20,
  duration: number = DURATIONS.normal
) => {
  const transforms = {
    top: `translateY(-${distance}px)`,
    right: `translateX(${distance}px)`,
    bottom: `translateY(${distance}px)`,
    left: `translateX(-${distance}px)`,
  };

  return {
    keyframes: [
      { transform: transforms[direction], opacity: 0 },
      { transform: 'translate(0, 0)', opacity: 1 },
    ],
    duration,
    easing: EASING.easeOut,
    fill: 'forwards' as FillMode,
  };
};

/**
 * Slide out to direction
 */
export const slideOut = (
  direction: 'top' | 'right' | 'bottom' | 'left',
  distance: number = 20,
  duration: number = DURATIONS.normal
) => {
  const transforms = {
    top: `translateY(-${distance}px)`,
    right: `translateX(${distance}px)`,
    bottom: `translateY(${distance}px)`,
    left: `translateX(-${distance}px)`,
  };

  return {
    keyframes: [
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: transforms[direction], opacity: 0 },
    ],
    duration,
    easing: EASING.easeIn,
    fill: 'forwards' as FillMode,
  };
};

/**
 * Scale animation
 */
export const scale = (
  from: number = 0.95,
  to: number = 1,
  duration: number = DURATIONS.fast
) => ({
  keyframes: [
    { transform: `scale(${from})`, opacity: 0 },
    { transform: `scale(${to})`, opacity: 1 },
  ],
  duration,
  easing: EASING.spring,
  fill: 'forwards' as FillMode,
});

/**
 * Bounce animation
 */
export const bounce = (
  intensity: number = 5,
  duration: number = DURATIONS.slow
) => ({
  keyframes: [
    { transform: 'translateY(0)' },
    { transform: `translateY(-${intensity}px)` },
    { transform: 'translateY(0)' },
    { transform: `translateY(-${intensity / 2}px)` },
    { transform: 'translateY(0)' },
  ],
  duration,
  easing: EASING.easeOut,
});

/**
 * Shake animation (for errors)
 */
export const shake = (duration: number = DURATIONS.slow) => ({
  keyframes: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(0)' },
  ],
  duration,
  easing: EASING.linear,
});

/**
 * Pulse animation
 */
export const pulse = (
  scale: number = 1.05,
  duration: number = DURATIONS.normal
) => ({
  keyframes: [
    { transform: 'scale(1)' },
    { transform: `scale(${scale})` },
    { transform: 'scale(1)' },
  ],
  duration,
  easing: EASING.easeInOut,
});

/**
 * Rotate animation
 */
export const rotate = (
  degrees: number = 360,
  duration: number = DURATIONS.normal
) => ({
  keyframes: [
    { transform: 'rotate(0deg)' },
    { transform: `rotate(${degrees}deg)` },
  ],
  duration,
  easing: EASING.linear,
});

/**
 * Ripple effect (for button clicks)
 */
export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.5)'
): void {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.style.position = 'absolute';
  circle.style.borderRadius = '50%';
  circle.style.backgroundColor = color;
  circle.style.pointerEvents = 'none';
  circle.classList.add('ripple');

  button.style.position = 'relative';
  button.style.overflow = 'hidden';

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  // Animate
  circle.animate(
    [
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(4)', opacity: 0 },
    ],
    {
      duration: 600,
      easing: EASING.easeOut,
    }
  ).onfinish = () => circle.remove();
}

// ============================================================================
// STAGGER UTILITIES
// ============================================================================

/**
 * Calculate stagger delay for list items
 */
export function calculateStaggerDelay(
  index: number,
  baseDelay: number = 50,
  maxDelay: number = 500
): number {
  return Math.min(index * baseDelay, maxDelay);
}

/**
 * Stagger animation config generator
 */
export function createStaggerConfig(
  totalItems: number,
  baseDelay: number = 50,
  maxDelay: number = 500
) {
  return Array.from({ length: totalItems }, (_, i) => ({
    delay: calculateStaggerDelay(i, baseDelay, maxDelay),
  }));
}

// ============================================================================
// SPRING PHYSICS
// ============================================================================

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const SPRING_CONFIGS: Record<string, SpringConfig> = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  default: { stiffness: 170, damping: 26, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 210, damping: 20, mass: 1 },
  slow: { stiffness: 280, damping: 60, mass: 1 },
};

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

/**
 * Get animation props that respect reduced motion
 */
export function getAnimationProps(
  prefersReducedMotion: boolean,
  normalProps: object,
  reducedProps: object = {}
) {
  return prefersReducedMotion ? reducedProps : normalProps;
}

/**
 * Conditional animation class
 */
export function animationClass(
  baseClass: string,
  prefersReducedMotion: boolean
): string {
  return prefersReducedMotion ? '' : baseClass;
}

// ============================================================================
// CSS CUSTOM PROPERTIES
// ============================================================================

/**
 * Generate CSS variables for animations
 */
export function generateAnimationCSSVars() {
  return `
    --duration-instant: ${DURATIONS.instant}ms;
    --duration-fast: ${DURATIONS.fast}ms;
    --duration-normal: ${DURATIONS.normal}ms;
    --duration-slow: ${DURATIONS.slow}ms;
    --duration-very-slow: ${DURATIONS.verySlow}ms;
    
    --easing-linear: ${EASING.linear};
    --easing-ease-in: ${EASING.easeIn};
    --easing-ease-out: ${EASING.easeOut};
    --easing-ease-in-out: ${EASING.easeInOut};
    --easing-spring: ${EASING.spring};
    
    --scale-subtle: ${SCALES.subtle};
    --scale-moderate: ${SCALES.moderate};
    --scale-expressive: ${SCALES.expressive};
  `;
}
