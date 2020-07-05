import {DX_NOTE_TYPES} from './constants.js';
import {roundFloat} from './formatHelper.js';

const EPSILON = 0.00011;

export function calculateAchvLoss(
  playerAchievement,
  finaleAchievement,
  finaleMaxAchievement,
  totalBaseScore,
  lostScorePerType
) {
  let dxAchievementLoss = 101 - playerAchievement;
  let finaleAchievementLoss = finaleMaxAchievement - finaleAchievement;
  const achievementLossPerType = {
    dx: new Map([["total", dxAchievementLoss && dxAchievementLoss.toFixed(4)]]),
    finale: new Map([
      [
        "total",
        finaleAchievementLoss && finaleAchievementLoss.toFixed(2)
      ]
    ]),
  };
  DX_NOTE_TYPES.forEach((noteType) => {
    if (noteType === "break") {
      return;
    }
    const loss = 100.0 * (lostScorePerType[noteType] || 0) / totalBaseScore;
    let dxLoss = dxAchievementLoss - loss <= EPSILON ? dxAchievementLoss : loss;
    dxLoss = roundFloat(dxLoss, "round", 10000);
    dxAchievementLoss -= dxLoss;
    achievementLossPerType.dx.set(noteType, dxLoss && dxLoss.toFixed(4));
    let finaleLoss = finaleAchievementLoss - loss <= EPSILON ? finaleAchievementLoss : loss;
    finaleLoss = roundFloat(finaleLoss, "round", 100);
    finaleAchievementLoss -= finaleLoss;
    achievementLossPerType.finale.set(noteType, finaleLoss && finaleLoss.toFixed(2));
  });
  achievementLossPerType.dx.set("break", dxAchievementLoss && dxAchievementLoss.toFixed(4));
  achievementLossPerType.finale.set("break", finaleAchievementLoss && finaleAchievementLoss.toFixed(2));
  return achievementLossPerType;
}
