import {roundFloat, sum} from '../common/number-helper';
import {calculateAchvLoss} from './achvLoss';
import {walkBreakDistributions} from './backtracing';
import {
  BASE_SCORE_PER_TYPE,
  BREAK_BONUS_POINTS,
  MAX_BREAK_POINTS,
  REGULAR_BASE_SCORE_MULTIPLIER,
} from './constants';
import {convertJudgementsToArray} from './judgementsHelper';
import {
  BreakScoreMap,
  FullNoteType,
  NoteType,
  StrictJudgementMap,
  StrictJudgementType,
} from './types';

function calculateBorder(
  totalBaseScore: number,
  breakCount: number,
  achievement: number | 'AP+',
  playerNoteScore: number
): number {
  if (achievement === 'AP+') {
    return totalBaseScore + breakCount * BREAK_BONUS_POINTS - playerNoteScore;
  }
  const rawBorder = totalBaseScore * achievement - playerNoteScore;
  if (rawBorder < 0) {
    return -1;
  }
  return roundFloat(rawBorder, 'ceil', 50);
}

/**
 * Given judgements per note type and player achievement (percentage from DX),
 * figure out its maimai FiNALE score and break distribution.
 * @param judgementsPerType Map<string, number[]>
 * @param playerAchievement number
 * @return various properties of playerScore
 */
export function calculateScoreInfo(
  judgementsPerType: Map<NoteType, StrictJudgementMap>,
  playerAchievement: number
) {
  let totalBaseScore = 0;
  let playerRegularNoteScore = 0;
  const playerScorePerType: Map<FullNoteType, {score: number; isMax: boolean}> = new Map([
    ['tap', {score: 0, isMax: false}],
    ['hold', {score: 0, isMax: false}],
    ['slide', {score: 0, isMax: false}],
    ['touch', {score: 0, isMax: false}],
    ['break', {score: 0, isMax: false}],
    ['total', {score: 0, isMax: false}],
  ]);
  const lostScorePerType = new Map();
  judgementsPerType.forEach((judgements, noteType) => {
    const noteBaseScore = BASE_SCORE_PER_TYPE[noteType];
    const count = sum(Object.values(judgements));
    const totalNoteScore = count * noteBaseScore;
    totalBaseScore += totalNoteScore;
    // We'll deal with player break score later.
    if (noteType !== 'break') {
      let playerNoteScore = 0;
      Object.keys(judgements).forEach((_j) => {
        const j = _j as StrictJudgementType;
        const count = judgements[j];
        playerNoteScore += count * noteBaseScore * REGULAR_BASE_SCORE_MULTIPLIER[j];
      });
      const loss = totalNoteScore - playerNoteScore;
      playerScorePerType.set(noteType, {score: playerNoteScore, isMax: loss === 0});
      lostScorePerType.set(noteType, loss);
      playerRegularNoteScore += playerNoteScore;
    }
  });

  // Figure out break distribution
  const scorePerPercentage = totalBaseScore / 100;
  const playerRegularNotePercentage = playerRegularNoteScore / scorePerPercentage;
  const remainingAchievement = playerAchievement - playerRegularNotePercentage;
  const basePercentagePerBreak = BASE_SCORE_PER_TYPE.break / scorePerPercentage;
  const validBreakDistributions: BreakScoreMap[] = [];
  const breakJudgements = judgementsPerType.get('break');
  walkBreakDistributions(
    validBreakDistributions,
    new Map(),
    convertJudgementsToArray(breakJudgements), // Make a copy of breakJudgements
    remainingAchievement,
    basePercentagePerBreak
  );
  console.log('valid break distributions', validBreakDistributions);
  let breakDistribution = validBreakDistributions[0];
  if (!breakDistribution) {
    console.warn('Could not find a valid break distribution!');
    console.warn('Please report the issue to the developer.');
    // Assume the worst case
    breakDistribution = new Map([
      [MAX_BREAK_POINTS, breakJudgements.cp || 0],
      [2550, 0], // P
      [2500, breakJudgements.perfect],
      [2000, 0], // Great
      [1500, 0], // Great
      [1250, breakJudgements.great], // Great
      [1000, breakJudgements.good],
      [0, breakJudgements.miss],
    ]);
  }

  // Figure out FiNALE achievement
  let totalBreakCount = 0;
  let playerBreakNoteScore = 0;
  breakDistribution.forEach((count, judgement) => {
    totalBreakCount += count;
    playerBreakNoteScore += count * judgement;
  });
  playerScorePerType.set('break', {
    score: playerBreakNoteScore,
    isMax: totalBreakCount === breakDistribution.get(2600),
  });
  const playerTotalNoteScore = playerRegularNoteScore + playerBreakNoteScore;
  const maxNoteScore = totalBaseScore + BREAK_BONUS_POINTS * totalBreakCount;
  playerScorePerType.set('total', {
    score: playerTotalNoteScore,
    isMax: playerTotalNoteScore === maxNoteScore,
  });
  const finaleAchievement = roundFloat(playerTotalNoteScore / scorePerPercentage, 'floor', 0.01);
  const finaleMaxAchievement = roundFloat(maxNoteScore / scorePerPercentage, 'floor', 0.01);

  // Figure out player achv per note type
  console.log('player score per note type', playerScorePerType);
  const dxAchvPerType = new Map();
  dxAchvPerType.set('tap', {
    score: roundFloat(playerScorePerType.get('tap').score / scorePerPercentage, 'round', 0.0001),
    isMax: playerScorePerType.get('tap').isMax,
  });
  dxAchvPerType.set('hold', {
    score: roundFloat(playerScorePerType.get('hold').score / scorePerPercentage, 'round', 0.0001),
    isMax: playerScorePerType.get('hold').isMax,
  });
  dxAchvPerType.set('slide', {
    score: roundFloat(playerScorePerType.get('slide').score / scorePerPercentage, 'round', 0.0001),
    isMax: playerScorePerType.get('slide').isMax,
  });
  dxAchvPerType.set('touch', {
    score: roundFloat(playerScorePerType.get('touch').score / scorePerPercentage, 'round', 0.0001),
    isMax: playerScorePerType.get('touch').isMax,
  });
  dxAchvPerType.set('break', {
    score: roundFloat(remainingAchievement, 'round', 0.0001),
    isMax: playerScorePerType.get('break').isMax,
  });
  dxAchvPerType.set('total', {
    score: roundFloat(playerAchievement, 'round', 0.0001),
    isMax: playerScorePerType.get('total').isMax,
  });

  // Figure out achievement loss per note type
  const achvLossDetail = calculateAchvLoss(
    judgementsPerType,
    breakDistribution,
    scorePerPercentage
  );
  console.log('achievement loss detail', achvLossDetail);

  // Figure out score diff vs. higher ranks
  const finaleBorder = new Map([
    ['S', calculateBorder(totalBaseScore, totalBreakCount, 0.97, playerTotalNoteScore)],
    ['S+', calculateBorder(totalBaseScore, totalBreakCount, 0.98, playerTotalNoteScore)],
    ['SS', calculateBorder(totalBaseScore, totalBreakCount, 0.99, playerTotalNoteScore)],
    ['SS+', calculateBorder(totalBaseScore, totalBreakCount, 0.995, playerTotalNoteScore)],
    ['SSS', calculateBorder(totalBaseScore, totalBreakCount, 1, playerTotalNoteScore)],
    ['AP+', calculateBorder(totalBaseScore, totalBreakCount, 'AP+', playerTotalNoteScore)],
  ]);

  // Figure out percentage per note
  const pctPerNoteType = new Map();
  const pctPerTap = 500 / scorePerPercentage;
  const bonusPctPerBreak = 1 / totalBreakCount;
  pctPerNoteType.set('tap', pctPerTap);
  pctPerNoteType.set('hold', pctPerTap * 2);
  pctPerNoteType.set('slide', pctPerTap * 3);
  pctPerNoteType.set('touch', pctPerTap);
  pctPerNoteType.set('breakDx', pctPerTap * 5 + bonusPctPerBreak);
  pctPerNoteType.set('break', pctPerTap * 5.2);

  return {
    finaleAchievement,
    maxFinaleScore: finaleMaxAchievement,
    breakDistribution,
    achvLossDetail,
    finaleBorder,
    pctPerNoteType,
    playerScorePerType,
    dxAchvPerType,
  };
}
