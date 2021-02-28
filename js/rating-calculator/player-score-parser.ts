import {SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {getDefaultLevel} from '../common/level-helper';
import {getRankByAchievement} from '../common/rank-functions';
import {ChartType} from '../common/song-props';
import {ChartRecord} from './types';

function getScoreMultiplier(achievement: number) {
  achievement = Math.min(achievement, SSSPLUS_MIN_ACHIEVEMENT);
  const rank = getRankByAchievement(achievement);
  if (!rank) {
    console.warn(`Could not find rank for achievement ${achievement.toFixed(4)}%`);
  }
  const factor = rank ? rank.factor : 5;
  const multiplier = (factor * achievement) / 100;
  return {factor, multiplier};
}

export function parseScoreLine(line: string): ChartRecord | undefined {
  const [songName, genre, difficulty, level, chartType, achievementText] = line.split("\t");
  if (songName && genre && difficulty && level && chartType && achievementText) {
    const achievement = parseFloat(achievementText);
    const scoreMultiplier = getScoreMultiplier(achievement);
    return {
      songName,
      genre,
      difficulty,
      level: getDefaultLevel(level),
      levelIsEstimate: true,
      chartType: chartType === "DX" ? ChartType.DX : ChartType.STANDARD,
      achievement,
      multiplier: scoreMultiplier.multiplier,
      rankFactor: scoreMultiplier.factor,
    };
  }
}
