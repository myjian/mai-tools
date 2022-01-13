import {BREAK_BASE_SCORE_MULTIPLIER, BREAK_BONUS_MULTIPLIER} from "../classic-layout/constants";
import {BreakScore, BreakScoreMap} from "../classic-layout/types";
import {roundFloat} from "../common/number-helper";

function backtrace(
  judgements: ReadonlyArray<number>,
  score: number,
  dist: BreakScoreMap,
  validDists: BreakScoreMap[]
): boolean {
  if (score < 0) return;
  let possibleValues: BreakScore[] = [];
  switch (judgements.length) {
    case 0:
      if (score === 0) {
        validDists.push(new Map(dist));
        return true;
      }
      return;
    case 1: // perfect
      possibleValues = [2600, 2550, 2500];
      break;
    case 2: // great
      // NOTE: The distribution of great break notes will affect DX achievement. This is where we get different results.
      possibleValues = [2000, 1500, 1250];
      break;
    case 3: // good
      possibleValues = [1000];
      break;
    default:
      // miss
      possibleValues = [0];
      break;
  }
  const isPerfect = judgements.length === 1;
  const noteCount = judgements[judgements.length - 1];
  if (dist.get(2000) && dist.get(1250)) {
    console.log(noteCount, score);
  }
  if (possibleValues.length === 3) {
    for (let i = noteCount; i >= 0; i--) {
      dist.set(possibleValues[0], i);
      const remainingScore = score - possibleValues[0] * i;
      if (remainingScore < 0) {
        continue;
      }
      // Assume num of 2550 > num of 2500, so we skip half the cases.
      // E.g. when (noteCount - i) == 6, check 6, 5, 4, 3.
      //      when (noteCount - i) == 5, check 5, 4, 3
      const jBound = isPerfect ? (noteCount - i + 1) >> 1 : 0;
      // const jBound = 0;
      for (let j = noteCount - i; j >= jBound; j--) {
        const k = noteCount - i - j;
        dist.set(possibleValues[1], j);
        dist.set(possibleValues[2], k);
        const success = backtrace(
          judgements.slice(0, judgements.length - 1),
          remainingScore - possibleValues[1] * j - possibleValues[2] * k,
          dist,
          validDists
        );
        if (dist.get(2000) && dist.get(1250)) {
          console.log(i, j, k, remainingScore, success);
        }
        if (success && isPerfect) {
          // We only need one distribution for perfect judgement.
          // The distributions of 2600-2550-2500 will not affect the percentage.
          // For example, 1-0-1 -> bonus * 1.0 + bonus * 0.5 = bonus * 1.5
          //              0-2-0 -> bonus * 0.75 * 2 = bonus * 1.5
          return;
        }
      }
    }
  } else if (possibleValues.length === 1) {
    dist.set(possibleValues[0], noteCount);
    backtrace(
      judgements.slice(0, judgements.length - 1),
      score - possibleValues[0] * noteCount,
      dist,
      validDists
    );
  } else {
    console.error("Unreachable");
  }
}

export function calculateDxAchvFromFinaleResult(
  achv: number,
  totalScore: number,
  breakScore: number,
  breakJudgements: ReadonlyArray<number>
): Map<string, BreakScoreMap> {
  const hundredAchvScore = roundFloat((totalScore / achv) * 100, "floor", 50);
  const totalBreakCount = breakJudgements.reduce((a, b) => a + b, 0);
  if (
    achv <= 0 ||
    totalScore <= 0 ||
    breakScore > totalScore ||
    hundredAchvScore <= 0 ||
    totalBreakCount <= 0
  ) {
    return new Map();
  }
  const breakDistributions: BreakScoreMap[] = [];
  backtrace(breakJudgements, breakScore, new Map(), breakDistributions);
  if (!breakDistributions.length) {
    console.warn(
      `Could not find break distribution for achv=${achv}, totalScore=${totalScore}, breakScore=${breakScore}, breakJudgements=${breakJudgements.join(
        "-"
      )}`
    );
    return new Map();
  }

  const achvWithoutBreak = (100 * (totalScore - breakScore)) / hundredAchvScore;
  const baseAchvPerBreak = (100 * 2500) / hundredAchvScore;
  const bonusAchvPerBreak = 1 / totalBreakCount;
  const possibleDxAchvs = new Map<string, BreakScoreMap>();
  for (const dist of breakDistributions) {
    let achv = achvWithoutBreak;
    dist.forEach((count, score) => {
      achv += count * BREAK_BASE_SCORE_MULTIPLIER.get(score) * baseAchvPerBreak;
      achv += count * BREAK_BONUS_MULTIPLIER.get(score) * bonusAchvPerBreak;
    });
    const achvText = roundFloat(achv, "floor", 0.0001).toFixed(4);
    possibleDxAchvs.set(achvText, dist);
  }
  console.log(possibleDxAchvs);
  return possibleDxAchvs;
}
