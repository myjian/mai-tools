import {
  BASE_SCORE_PER_TYPE,
  BREAK_BASE_SCORE_MULTIPLIER,
  BREAK_BONUS_MULTIPLIER,
  EMPTY_JUDGEMENT_OBJ,
  REGULAR_BASE_SCORE_MULTIPLIER,
} from './constants';
import {sum} from './numberHelper';
import {FullJudgementMap, FullNoteType, NoteType, StrictJudgementMap} from './types';

type MapKey = keyof FullJudgementMap;

function createEmptyJudgementMap(): FullJudgementMap {
  return Object.assign({total: 0}, EMPTY_JUDGEMENT_OBJ);
}

export function calculateAchvLoss(
  judgementsPerType: Map<NoteType, StrictJudgementMap>,
  breakDistribution: Map<number, number>,
  scorePerPercentage: number,
): {dx: Map<FullNoteType, FullJudgementMap>, finale: Map<FullNoteType, FullJudgementMap>} {
  const dxTotalLoss = createEmptyJudgementMap();
  const finaleTotalLoss = createEmptyJudgementMap();
  const achievementLossPerType = {dx: new Map(), finale: new Map()};
  const totalBreakCount = sum(Object.values(judgementsPerType.get("break")));
  judgementsPerType.forEach((judgements, noteType) => {
    const baseScore = BASE_SCORE_PER_TYPE[noteType];
    const finaleNoteLoss = createEmptyJudgementMap();
    const dxNoteLoss = createEmptyJudgementMap();
    if (noteType === "break") {
      finaleNoteLoss.perfect = breakDistribution.get(2550) * -50 + breakDistribution.get(2500) * -100;
      finaleNoteLoss.great = (
        breakDistribution.get(2000) * -600
        + breakDistribution.get(1500) * -1100
        + breakDistribution.get(1250) * -1350
      );
      finaleNoteLoss.good = breakDistribution.get(1000) * -1600;
      finaleNoteLoss.miss = breakDistribution.get(0) * -2600;
      finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => (a + b), 0);

      dxNoteLoss.perfect = (
        breakDistribution.get(2550) * (BREAK_BONUS_MULTIPLIER.get(2550) - 1)
        + breakDistribution.get(2500) * (BREAK_BONUS_MULTIPLIER.get(2500) - 1)
      ) / totalBreakCount;
      dxNoteLoss.great = (
        breakDistribution.get(2000) * (BREAK_BASE_SCORE_MULTIPLIER.get(2000) - 1)
        + breakDistribution.get(1500) * (BREAK_BASE_SCORE_MULTIPLIER.get(1500) - 1)
        + breakDistribution.get(1250) * (BREAK_BASE_SCORE_MULTIPLIER.get(1250) - 1)
      ) * baseScore / scorePerPercentage + (
        breakDistribution.get(2000) * (BREAK_BONUS_MULTIPLIER.get(2000) - 1)
        + breakDistribution.get(1500) * (BREAK_BONUS_MULTIPLIER.get(1500) - 1)
        + breakDistribution.get(1250) * (BREAK_BONUS_MULTIPLIER.get(1250) - 1)
      ) / totalBreakCount;
      dxNoteLoss.good = (
        breakDistribution.get(1000) * (BREAK_BASE_SCORE_MULTIPLIER.get(1000) - 1)
      ) * baseScore / scorePerPercentage + (
        breakDistribution.get(1000) * (BREAK_BONUS_MULTIPLIER.get(1000) - 1)
      ) / totalBreakCount;
      dxNoteLoss.miss = -(
        breakDistribution.get(0) * baseScore / scorePerPercentage
        + breakDistribution.get(0) / totalBreakCount
      );
      dxNoteLoss.total = Object.values(dxNoteLoss).reduce((a, b) => (a + b), 0);
    } else {
      finaleNoteLoss.perfect = 0;
      finaleNoteLoss.great = judgements.great * baseScore * (REGULAR_BASE_SCORE_MULTIPLIER.great - 1);
      finaleNoteLoss.good = judgements.good * baseScore * (REGULAR_BASE_SCORE_MULTIPLIER.good - 1);
      finaleNoteLoss.miss = judgements.miss * baseScore * (-1);
      finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => (a + b), 0);
      for (const [j, loss] of Object.entries(finaleNoteLoss)) {
        dxNoteLoss[j as MapKey] = loss / scorePerPercentage;
      }
    }
    for (const [j, loss] of Object.entries(finaleNoteLoss)) {
      finaleTotalLoss[j as MapKey] += loss;
    }
    for (const [j, loss] of Object.entries(dxNoteLoss)) {
      dxTotalLoss[j as MapKey] += loss;
    }
    achievementLossPerType.finale.set(noteType, finaleNoteLoss);
    achievementLossPerType.dx.set(noteType, dxNoteLoss);
  });
  achievementLossPerType.finale.set("total", finaleTotalLoss);
  achievementLossPerType.dx.set("total", dxTotalLoss);
  return achievementLossPerType;
}
