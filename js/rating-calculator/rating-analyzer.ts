import {DIFFICULTIES, DxVersion, SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {getRankByAchievement} from '../common/rank-functions';
import {ChartType, getSongProperties, SongProperties} from '../common/song-props';
import {compareSongsByRating} from './record-comparator';
import {ChartRecord, ChartRecordWithRating, RatingData} from './types';

const NUM_TOP_NEW_SONGS = 15;
const NUM_TOP_OLD_SONGS = 25;
const NUM_TOP_OLD_SONGS_SPLASH_PLUS = 35;

function getScoreMultiplier(achievement: number, gameVer: DxVersion) {
  achievement = Math.min(achievement, SSSPLUS_MIN_ACHIEVEMENT);
  const rank = getRankByAchievement(achievement, gameVer);
  if (!rank) {
    console.warn(`Could not find rank for achievement ${achievement.toFixed(4)}%`);
  }
  const factor = rank ? rank.factor : 5;
  return (factor * achievement) / 100;
}

export function getNumOfTopNewCharts() {
  return NUM_TOP_NEW_SONGS;
}

export function getNumOfTopOldCharts(gameVer: DxVersion) {
  return gameVer > DxVersion.SPLASH ? NUM_TOP_OLD_SONGS_SPLASH_PLUS : NUM_TOP_OLD_SONGS;
}

/**
 * Compute rating value based on the chart level and player achievement.
 * If we don't find the inner level for the chart, use its estimated level and move on.
 */
export function analyzeSongRating(
  gameVer: DxVersion,
  record: ChartRecord,
  songProps?: SongProperties
): ChartRecordWithRating {
  if (songProps) {
    const lvIndex = DIFFICULTIES.indexOf(record.difficulty);
    const lv = songProps.lv[lvIndex];
    if (typeof lv === "number") {
      record.levelIsEstimate = lv < 0;
      record.level = Math.abs(lv);
    }
  }
  return {
    ...record,
    rating: record.level * getScoreMultiplier(record.achievement, gameVer),
  };
}

export async function analyzePlayerRating(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  playerScores: ReadonlyArray<ChartRecord>,
  gameVer: DxVersion
): Promise<RatingData> {
  const newChartRecords = [];
  const oldChartRecords = [];
  for (const record of playerScores) {
    const songProps = getSongProperties(
      songPropsByName,
      record.songName,
      record.genre,
      record.chartType
    );
    const isNewChart = songProps ? songProps.debut === gameVer : record.chartType === ChartType.DX;
    const recordWithRating = analyzeSongRating(gameVer, record, songProps);
    if (isNewChart) {
      newChartRecords.push(recordWithRating);
    } else {
      oldChartRecords.push(recordWithRating);
    }
  }

  newChartRecords.sort(compareSongsByRating);
  oldChartRecords.sort(compareSongsByRating);

  let newChartsRating = 0;
  const newTopChartsCount = Math.min(NUM_TOP_NEW_SONGS, newChartRecords.length);
  for (let i = 0; i < newTopChartsCount; i++) {
    const rec = newChartRecords[i];
    rec.isTarget = true;
    newChartsRating += Math.floor(rec.rating);
  }

  let oldChartsRating = 0;
  const oldTopChartsCount = Math.min(getNumOfTopOldCharts(gameVer), oldChartRecords.length);
  for (let i = 0; i < oldTopChartsCount; i++) {
    const rec = oldChartRecords[i];
    rec.isTarget = true;
    oldChartsRating += Math.floor(rec.rating);
  }

  return {
    newChartRecords,
    newChartsRating,
    newTopChartsCount,
    oldChartRecords,
    oldChartsRating,
    oldTopChartsCount,
  };
}
