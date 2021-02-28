import {DIFFICULTIES} from '../common/constants';
import {ChartType, getSongProperties, SongProperties} from '../common/song-props';
import {compareSongsByRating} from './record-comparator';
import {ChartRecord, ChartRecordWithRating, RatingData} from './types';

const NUM_TOP_NEW_SONGS = 15;
const NUM_TOP_OLD_SONGS = 25;

/**
 * Compute rating value based on the chart level and player achievement.
 * If we don't find the inner level for the chart, use its estimated level and move on.
 */
export function analyzeSongRating(
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
    rating: record.level * record.multiplier,
  };
}

export async function analyzePlayerRating(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  playerScores: ReadonlyArray<ChartRecord>,
  gameVersion: number
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
    const isNewChart = songProps
      ? songProps.debut === gameVersion
      : record.chartType === ChartType.DX;
    const recordWithRating = analyzeSongRating(record, songProps);
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
    newChartsRating += Math.floor(newChartRecords[i].rating);
  }

  let oldChartsRating = 0;
  const oldTopChartsCount = Math.min(NUM_TOP_OLD_SONGS, oldChartRecords.length);
  for (let i = 0; i < oldTopChartsCount; i++) {
    oldChartsRating += Math.floor(oldChartRecords[i].rating);
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
