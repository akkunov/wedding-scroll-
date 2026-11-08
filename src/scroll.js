export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function sceneState(progress) {
  const p = clamp(progress);
  return { rotation: p * Math.PI * 2 + .22, garden: smooth((p - .12) / .22) * (1 - smooth((p - .51) / .19)), hall: smooth((p - .49) / .2), chapter: Math.min(3, Math.floor(p * 4)) };
}
