export function lerp(previous, current, factor = 0.35) {
  if (previous == null) return current;
  return previous + (current - previous) * factor;
}

export function smoothTransform(previous, current, factor = 0.35) {
  if (!current) return null;
  if (!previous) return { ...current };

  return {
    x: lerp(previous.x, current.x, factor),
    y: lerp(previous.y, current.y, factor),
    width: lerp(previous.width, current.width, factor),
    height: lerp(previous.height, current.height, factor),
    rotation: lerp(previous.rotation, current.rotation, factor),
    opacity: lerp(previous.opacity, current.opacity, factor),
  };
}
