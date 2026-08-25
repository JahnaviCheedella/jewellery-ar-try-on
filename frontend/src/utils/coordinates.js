export function landmarkToCanvas(landmark, canvas, mirrored = true) {
  if (!landmark || !canvas) return null;

  return {
    x: (mirrored ? 1 - landmark.x : landmark.x) * canvas.width,
    y: landmark.y * canvas.height,
  };
}

export function distance(a, b) {
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function angle(a, b) {
  if (!a || !b) return 0;
  return Math.atan2(b.y - a.y, b.x - a.x);
}
