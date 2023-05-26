export const MAX_LEVEL = 15;

const MIN_LEVEL = 1;
const THRESHOLD_TO_PLUS = 0.6;
const DEFAULT_PLUS_MINOR_LV = THRESHOLD_TO_PLUS + 0.1;

export function getOfficialLevel(level: number): string {
  const baseLevel = Math.floor(level);
  const minorLevel = level - baseLevel;
  return minorLevel > THRESHOLD_TO_PLUS ? baseLevel + '+' : baseLevel.toString();
}

/**
 * Compute the default level based on the official level.
 * For example:
 *   Lv10 => 10.0 (actual range: 10.0 - 10.6)
 *   Lv10 => 10.7 (actual range: 10.7 - 10.9)
 */
export function getDefaultLevel(officialLevel: string | undefined): number {
  if (!officialLevel) {
    return MIN_LEVEL;
  }
  const baseLevel = parseInt(officialLevel);
  // 9 : 9.0 - 9.6
  // 9+: 9.7 - 9.9
  return officialLevel.endsWith('+') ? baseLevel + DEFAULT_PLUS_MINOR_LV : baseLevel;
}

export function getDisplayLv(internalLv: number): string {
  const lvIsEstimate = internalLv < 0;
  if (!lvIsEstimate) {
    return internalLv.toFixed(1);
  }
  const absLv = Math.abs(internalLv);
  const majorLv = Math.floor(absLv);
  return majorLv === absLv ? majorLv.toFixed(0) : majorLv.toFixed(0) + '+';
}
