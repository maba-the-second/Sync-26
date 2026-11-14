// Render-rate helpers for the 3D scene.

const MAX_DELTA = 1 / 30;

export function clampedDelta(delta: number): number {
  return Math.min(delta, MAX_DELTA);
}

export function damp(
  current: number,
  target: number,
  lambda: number,
  delta: number
): number {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

export const LAMBDA = {
  smooth: 3.08,
  snappy: 7.67,
  medium: 3.71,
} as const;
