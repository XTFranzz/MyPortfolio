export function fibonacciSphere(count, radius = 1) {
  const points = [];
  const offset = 2 / count;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * goldenAngle;

    points.push({
      x: Math.cos(phi) * r * radius,
      y: y * radius,
      z: Math.sin(phi) * r * radius,
    });
  }

  return points;
}

export function tiltPoints(points, degrees) {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return points.map(({ x, y, z }) => ({
    x,
    y: y * cos - z * sin,
    z: y * sin + z * cos,
  }));
}
