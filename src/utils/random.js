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
  if (min === max) return min;
  const range = max - min + 1;
  // rejection sampling for perfect uniformity
  const limit = Math.floor(0x100000000 / range) * range;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return (buf[0] % range) + min;
}

/** Fisher-Yates shuffle (in-place), returns the array */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick n unique items at random from arr */
export function pickUnique(arr, n) {
  const pool = [...arr];
  shuffle(pool);
  return pool.slice(0, Math.min(n, pool.length));
}

/** Pick n items with replacement from arr */
export function pickWithReplacement(arr, n) {
  return Array.from({ length: n }, () => arr[randInt(0, arr.length - 1)]);
}
