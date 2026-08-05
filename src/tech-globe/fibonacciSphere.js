const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function fibonacciSphere(n, r) {
  if (n === 1) return [{ x: 0, y: 0, z: r, phase: 0 }];

  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;

    return {
      x: Math.cos(theta) * radiusAtY * r,
      y: y * r,
      z: Math.sin(theta) * radiusAtY * r,
      phase: i * GOLDEN_ANGLE,
    };
  });
}
