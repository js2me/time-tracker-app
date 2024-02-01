export function degToRad(deg: number) {
  return deg * (Math.PI / 180.0);
}
export function radToDeg(rad: number) {
  return rad * (180.0 / Math.PI);
}

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
