import {roundFloat} from './number-helper';

/*
  ✦ - 85%
  ✦✦ - 90%
  ✦✦✦ - 93%
  ✦✦✦✦ - 95%
  ✦✦✦✦✦ - 97%
  ✦6 - 99%
  ✦7 - 100%
*/
const THRESHOLD = [0, 0.85, 0.9, 0.93, 0.95, 0.97, 0.99, 1];

export function determineDxStar(dxScoreRatio: number): number {
  for (let i = THRESHOLD.length - 1; i > 0; i--) {
    if (dxScoreRatio >= THRESHOLD[i]) {
      return i;
    }
  }
  return 0;
}

export function getDxStarText(index: number, displayZero = false): string {
  return displayZero ? `✦${index}` : index ? `✦${index}` : '';
}

// This function is only functional on recent play records page and single play record page!
export function calculateDetailedDxStar(row: HTMLElement) {
  const block = row.querySelector('.playlog_result_innerblock .playlog_score_block');
  if (!block) {
    return 0;
  }
  const dxScoreLabel = block.querySelector('.w_80');
  if (!dxScoreLabel) {
    // do nothing if this function is run more than once
    return;
  }
  dxScoreLabel.remove();
  const [playerDxScore, maxDxScore] = block.textContent
    .split('/')
    .map((t) => parseInt(t.replace(',', '').trim()));
  const dxScoreRatio = playerDxScore / maxDxScore;
  const dxStarIndex = determineDxStar(dxScoreRatio);
  const dxStar = `✦${dxStarIndex} (${roundFloat(dxScoreRatio * 100, 'floor', 0.1).toFixed(1)}%)`;
  const dxStarBlock = document.createElement('div');
  dxStarBlock.className = 'white p_r_5 f_15 f_l';
  dxStarBlock.append(dxStar);
  block.prepend(dxStarBlock);
  return dxStarIndex;
}
