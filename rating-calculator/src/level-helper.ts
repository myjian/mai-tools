const THRESHOLD_TO_PLUS = 0.6;

export function getOfficialLevel(level: number): string {
  const baseLevel = Math.floor(level);
  const minorLevel = level - baseLevel;
  return minorLevel > THRESHOLD_TO_PLUS ? baseLevel + "+" : baseLevel.toString();
}
