/**
 * Cryptographically fair random utilities using crypto.getRandomValues().
 * Never uses Math.random().
 */

/** Returns a float in [0, 1) */
export function rand() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

/** Returns an integer in [min, max] inclusive */
export function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/**
 * Fisher-Yates shuffle (in-place), returns the array.
 * Uses crypto.getRandomValues for each swap.
 */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick `n` unique items at random from `arr`.
 * If n >= arr.length, returns a shuffled copy of the full array.
 */
export function pickUnique(arr, n) {
  const pool = [...arr];
  shuffle(pool);
  return pool.slice(0, Math.min(n, pool.length));
}

/**
 * Pick `n` items at random from `arr` (with replacement).
 */
export function pickWithReplacement(arr, n) {
  return Array.from({ length: n }, () => arr[Math.floor(rand() * arr.length)]);
}
