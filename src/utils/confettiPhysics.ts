/**
 * Confetti Physics Utilities
 * 
 * Physics simulation for confetti particles with gravity, wind, and rotation.
 */

export interface ConfettiParticle {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  velocity: {
    x: number;
    y: number;
  };
  color: string;
  size: number;
  opacity: number;
}

export interface ConfettiConfig {
  particleCount?: number;
  colors?: string[];
  spread?: number; // degrees
  origin?: { x: number; y: number };
  gravity?: number;
  wind?: number;
  initialVelocity?: number;
  decay?: number;
}

const DEFAULT_CONFIG: Required<ConfettiConfig> = {
  particleCount: 50,
  colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
  spread: 60,
  origin: { x: 0.5, y: 0.5 },
  gravity: 0.3,
  wind: 0.05,
  initialVelocity: 15,
  decay: 0.97,
};

export function createConfettiParticles(
  canvasWidth: number,
  canvasHeight: number,
  config: ConfettiConfig = {}
): ConfettiParticle[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const particles: ConfettiParticle[] = [];

  const originX = canvasWidth * cfg.origin.x;
  const originY = canvasHeight * cfg.origin.y;
  const spreadRad = (cfg.spread * Math.PI) / 180;

  for (let i = 0; i < cfg.particleCount; i++) {
    // Random angle within spread
    const angle = Math.random() * spreadRad - spreadRad / 2 - Math.PI / 2;
    const velocity = cfg.initialVelocity * (0.5 + Math.random() * 0.5);

    particles.push({
      x: originX,
      y: originY,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      velocity: {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
      },
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      size: 8 + Math.random() * 8,
      opacity: 1,
    });
  }

  return particles;
}

export function updateParticle(
  particle: ConfettiParticle,
  config: ConfettiConfig = {}
): ConfettiParticle {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  return {
    ...particle,
    x: particle.x + particle.velocity.x,
    y: particle.y + particle.velocity.y,
    rotation: particle.rotation + particle.rotationSpeed,
    velocity: {
      x: particle.velocity.x * cfg.decay + cfg.wind,
      y: particle.velocity.y * cfg.decay + cfg.gravity,
    },
    opacity: particle.opacity * 0.98,
  };
}

export function isParticleActive(
  particle: ConfettiParticle,
  canvasHeight: number
): boolean {
  return particle.y < canvasHeight + 100 && particle.opacity > 0.01;
}

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: ConfettiParticle
): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate((particle.rotation * Math.PI) / 180);
  ctx.globalAlpha = particle.opacity;
  ctx.fillStyle = particle.color;
  
  // Draw rectangle
  ctx.fillRect(
    -particle.size / 2,
    -particle.size / 2,
    particle.size,
    particle.size / 2
  );
  
  ctx.restore();
}
