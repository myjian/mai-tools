import {getDefaultLevel} from '../common/level-helper';
import {ChartType} from '../common/song-props';
import {ChartRecord} from './types';

export function parseScoreLine(line: string): ChartRecord | undefined {
  const [songName, genre, difficulty, level, chartType, achievementText] = line.split("\t");
  if (songName && genre && difficulty && level && chartType && achievementText) {
    const achievement = parseFloat(achievementText);
    return {
      songName,
      genre,
      difficulty,
      level: getDefaultLevel(level),
      levelIsEstimate: true,
      chartType: chartType === "DX" ? ChartType.DX : ChartType.STANDARD,
      achievement,
    };
  }
}
