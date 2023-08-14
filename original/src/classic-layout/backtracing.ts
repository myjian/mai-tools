import {BREAK_BASE_SCORE_MULTIPLIER, BREAK_BONUS_MULTIPLIER, MAX_BREAK_POINTS} from './constants';
import {BreakScoreMap} from './types';

/*
 * @param breakDistribution Map<number, number>
 * @return number bestAchievement of this break judgement
 */
export function walkBreakDistributions(
  validBreakDistributions: BreakScoreMap[],
  breakDistribution: BreakScoreMap,
  breakJudgements: ReadonlyArray<number>,
  remainingAchievement: number,
  basePercentagePerBreak: number,
): number {
  let noteCount = breakJudgements[0];
  let isBestAchievementSet = false;
  let bestAchievement = 0;
  switch (breakJudgements.length) {
    case 5: // Critical Perfect
      breakDistribution.set(MAX_BREAK_POINTS, noteCount);
      return walkBreakDistributions(
        validBreakDistributions,
        breakDistribution,
        breakJudgements.slice(1),
        remainingAchievement,
        basePercentagePerBreak
      );
    case 4: // Perfect
      let cpLowerBound = 0, cpUpperBound = noteCount;
      if (breakDistribution.has(MAX_BREAK_POINTS)) {
        const cpCount = breakDistribution.get(MAX_BREAK_POINTS);
        noteCount += cpCount;
        cpLowerBound = cpCount;
        cpUpperBound = cpCount;
      }
      for (let i = cpUpperBound; i >= cpLowerBound; i--) {
        breakDistribution.set(MAX_BREAK_POINTS, i);
        for (let j = noteCount - i; j >= 0; j--) {
          breakDistribution.set(2550, j);
          breakDistribution.set(2500, noteCount - i - j);
          const playerAchievement = walkBreakDistributions(
            validBreakDistributions,
            breakDistribution,
            breakJudgements.slice(1),
            remainingAchievement,
            basePercentagePerBreak
          );
          if (!isBestAchievementSet) {
            bestAchievement = playerAchievement;
            isBestAchievementSet = true;
          }
          if (playerAchievement < remainingAchievement) {
            // playerAchievement will not get better for smaller j. Try next i.
            break;
          }
        }
      }
      return bestAchievement;
    case 3: // Great
      for (let i = noteCount; i >= 0; i--) {
        breakDistribution.set(2000, i);
        for (let j = noteCount - i; j >= 0; j--) {
          breakDistribution.set(1500, j);
          breakDistribution.set(1250, noteCount - i - j);
          const playerAchievement = walkBreakDistributions(
            validBreakDistributions,
            breakDistribution,
            breakJudgements.slice(1),
            remainingAchievement,
            basePercentagePerBreak
          );
          if (!isBestAchievementSet) {
            bestAchievement = playerAchievement;
            isBestAchievementSet = true;
          }
          if (playerAchievement < remainingAchievement) {
            // playerAchievement will not get better for smaller j. Try next i.
            break;
          }
        }
      }
      return bestAchievement;
    case 2: // Good
      breakDistribution.set(1000, noteCount);
      return walkBreakDistributions(
        validBreakDistributions,
        breakDistribution,
        breakJudgements.slice(1),
        remainingAchievement,
        basePercentagePerBreak
      );
    case 1: // Miss
      breakDistribution.set(0, noteCount);
      return walkBreakDistributions(
        validBreakDistributions,
        breakDistribution,
        breakJudgements.slice(1),
        remainingAchievement,
        basePercentagePerBreak
      );
    case 0: // Validate
      let totalCount = 0;
      let bonusAchievementSum = 0.0;
      let playerAchievement = 0;
      breakDistribution.forEach((count, judgement) => {
        totalCount += count;
        playerAchievement +=
          count *
          BREAK_BASE_SCORE_MULTIPLIER.get(judgement)! *
          basePercentagePerBreak;
        bonusAchievementSum += count * BREAK_BONUS_MULTIPLIER.get(judgement)!;
      });
      playerAchievement += bonusAchievementSum / totalCount;
      remainingAchievement -= playerAchievement;
      if (Math.abs(remainingAchievement) < 0.0001) {
        validBreakDistributions.push(new Map(breakDistribution));
      }
      return playerAchievement;
    default:
      throw new Error("unreachable");
  }
}
