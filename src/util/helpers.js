export function nextPowerOf2(n) {
  n = n - 1

  while (n & n - 1) {
    n = n & n - 1
  }

  return n << 1
}
