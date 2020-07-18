import {getRankByAchievement} from './rank-functions';
import {SSSPLUS_MIN_ACHIEVEMENT} from './shared-constants';
import {ChartRecord} from './types';

const MIN_LEVEL = 1;

/**
 * Compute the default level based on the official level.
 * For example:
 *   Lv10 => 10.0 (actual range: 10.0 - 10.6)
 *   Lv10 => 10.7 (actual range: 10.7 - 10.9)
 */
function getDefaultLevel(officialLevel: string) {
  if (!officialLevel) {
    return MIN_LEVEL;
  }
  const baseLevel = parseInt(officialLevel);
  // 9 : 9.0 - 9.6
  // 9+: 9.7 - 9.9
  return officialLevel.endsWith("+") ? baseLevel + 0.7 : baseLevel;
}

function getScoreMultiplier(achievement: number, isDxPlus: boolean) {
  achievement = Math.min(achievement, SSSPLUS_MIN_ACHIEVEMENT);
  const rank = getRankByAchievement(achievement, isDxPlus);
  if (!rank) {
    console.warn(`Could not find rank for achievement ${achievement.toFixed(4)}%`);
  }
  const factor = rank ? rank.factor : 5;
  const multiplier = factor * achievement / 100;
  return {factor, multiplier};
}

export function parseScoreLine(line: string, isDxPlus: boolean): ChartRecord | undefined {
  const [
    songName,
    genre,
    difficulty,
    level,
    chartType,
    achievementText,
  ] = line.split("\t");
  if (songName && genre && difficulty && level && chartType && achievementText) {
    const achievement = parseFloat(achievementText);
    const scoreMultiplier = getScoreMultiplier(achievement, isDxPlus);
    return {
      songName,
      genre,
      difficulty,
      level: getDefaultLevel(level),
      levelIsEstimate: true,
      chartType,
      achievement,
      multiplier: scoreMultiplier.multiplier,
      rankFactor: scoreMultiplier.factor,
    };
  }
}
