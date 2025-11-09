/**
 * Performance Monitoring Utilities
 * 
 * Tools for tracking animation performance and ensuring 60fps target.
 * Logs warnings when animations drop below performance budgets.
 */

// Performance budgets (in milliseconds)
export const PERFORMANCE_BUDGETS = {
  TARGET_FPS: 60,
  FRAME_BUDGET: 16.67, // 1000ms / 60fps
  WARNING_FPS: 55,
  CRITICAL_FPS: 50,
  MAX_ANIMATION_DURATION: 300,
  MAX_CONCURRENT_ANIMATIONS: 3,
  PAINT_BUDGET: 10,
  COMPOSITE_BUDGET: 5,
} as const;

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  fps?: number;
  frames: number[];
}

// Store active performance monitors
const activeMonitors = new Map<string, PerformanceMetrics>();

/**
 * Monitor animation performance
 * Returns a function to stop monitoring
 */
export function monitorAnimationPerformance(name: string): () => void {
  const metrics: PerformanceMetrics = {
    name,
    startTime: performance.now(),
    frames: [],
  };

  activeMonitors.set(name, metrics);

  let lastFrameTime = metrics.startTime;
  let animationFrameId: number;

  // Track frame times
  const measureFrame = () => {
    const now = performance.now();
    const frameDuration = now - lastFrameTime;
    
    metrics.frames.push(frameDuration);
    lastFrameTime = now;

    // Check if we're dropping frames
    if (frameDuration > PERFORMANCE_BUDGETS.FRAME_BUDGET * 1.2) {
      console.warn(
        `[Animation Performance] Frame drop in "${name}": ${frameDuration.toFixed(2)}ms`
      );
    }

    animationFrameId = requestAnimationFrame(measureFrame);
  };

  animationFrameId = requestAnimationFrame(measureFrame);

  // Return stop function
  return () => {
    cancelAnimationFrame(animationFrameId);
    
    metrics.endTime = performance.now();
    metrics.duration = metrics.endTime - metrics.startTime;

    // Calculate average FPS
    if (metrics.frames.length > 0) {
      const avgFrameDuration =
        metrics.frames.reduce((a, b) => a + b, 0) / metrics.frames.length;
      metrics.fps = 1000 / avgFrameDuration;
    }

    activeMonitors.delete(name);

    // Log results
    logPerformanceMetrics(metrics);
  };
}

/**
 * Log performance metrics with warnings
 */
function logPerformanceMetrics(metrics: PerformanceMetrics) {
  const { name, duration, fps } = metrics;

  if (!duration || !fps) return;

  // Check duration budget
  if (duration > PERFORMANCE_BUDGETS.MAX_ANIMATION_DURATION) {
    console.warn(
      `[Animation Performance] "${name}" exceeded duration budget: ${duration.toFixed(2)}ms (max: ${PERFORMANCE_BUDGETS.MAX_ANIMATION_DURATION}ms)`
    );
  }

  // Check FPS
  if (fps < PERFORMANCE_BUDGETS.CRITICAL_FPS) {
    console.error(
      `[Animation Performance] "${name}" CRITICAL FPS: ${fps.toFixed(2)} (target: ${PERFORMANCE_BUDGETS.TARGET_FPS})`
    );
  } else if (fps < PERFORMANCE_BUDGETS.WARNING_FPS) {
    console.warn(
      `[Animation Performance] "${name}" low FPS: ${fps.toFixed(2)} (target: ${PERFORMANCE_BUDGETS.TARGET_FPS})`
    );
  } else if (process.env.NODE_ENV === 'development') {
    console.log(
      `[Animation Performance] "${name}" ✓ ${fps.toFixed(2)} fps, ${duration.toFixed(2)}ms`
    );
  }
}

/**
 * Get current performance report
 */
export function getPerformanceReport(): string {
  const active = Array.from(activeMonitors.entries());
  
  if (active.length === 0) {
    return 'No active animations being monitored.';
  }

  return `Active Animations (${active.length}):
${active.map(([name, metrics]) => {
  const elapsed = performance.now() - metrics.startTime;
  return `  - ${name}: ${elapsed.toFixed(2)}ms`;
}).join('\n')}`;
}

/**
 * Throttle function calls to improve performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (timeout) clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        if (Date.now() - (lastRan ?? 0) >= wait) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * RAF-based throttle for scroll/resize handlers
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * Measure layout shift (CLS - Cumulative Layout Shift)
 */
export function measureLayoutShift(callback: (cls: number) => void) {
  if (!('PerformanceObserver' in window)) return;

  let clsScore = 0;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsScore += (entry as any).value;
        callback(clsScore);
      }
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });

  return () => observer.disconnect();
}

/**
 * Check if animation is safe to run (performance-wise)
 */
export function canSafelyAnimate(): boolean {
  // Check if too many animations are already running
  if (activeMonitors.size >= PERFORMANCE_BUDGETS.MAX_CONCURRENT_ANIMATIONS) {
    console.warn(
      `[Animation Performance] Too many concurrent animations (${activeMonitors.size}). Skipping new animation.`
    );
    return false;
  }

  // Check battery status (if available)
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      if (battery.level < 0.2 && !battery.charging) {
        console.warn(
          '[Animation Performance] Low battery detected. Consider reducing animations.'
        );
      }
    });
  }

  return true;
}
