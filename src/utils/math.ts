// math.ts

export const EPS = 1e-6;
export const EPS_NANO = 1e-9;

export function nextPowerOfTwo(x: number): number {
  return 2 ** Math.ceil(Math.log2(x));
}

/**
 * randomBetween lower and upper, including lower but not upper.
 */
export function randomBetween(lower: number, upper: number): number {
  return Math.random() * (upper - lower) + lower;
}

/**
 * minmax
 * Given a number, it will be bounded by the given min and max.
 */
export function minmax(target: number, min: number, max: number): number {
  return Math.min(Math.max(target, min), max);
}
