const THRESHOLD = [0, 0.85, 0.9, 0.93, 0.95, 0.97, 0.99, 1];

export function determineDxStar(dxScoreRatio: number): number {
  for (let i = THRESHOLD.length - 1; i > 0; i--) {
    if (dxScoreRatio >= THRESHOLD[i]) {
      return i;
    }
  }
  return 0;
}

export function determineDxStarText(dxScoreRatio: number, displayZero = false): string {
  const dxStar = determineDxStar(dxScoreRatio);
  return displayZero ? `✦${dxStar}` : dxStar ? `✦${dxStar}` : "";
}
