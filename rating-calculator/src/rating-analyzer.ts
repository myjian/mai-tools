import {compareSongsByRating} from './record-comparator';
import {DIFFICULTIES} from './shared-constants';
import {ChartRecord, ChartRecordWithRating, SongProperties} from './types';

const NUM_TOP_NEW_SONGS = 15;
const NUM_TOP_OLD_SONGS = 25;

function isDxChart(chartType: string) {
  return chartType === "DX";
}

function getSongNickname(
  songName: string, genre: string, chartType?: string) {
  if (songName === "Link") {
    return genre.includes("niconico") ? "Link(nico)" : "Link(org)"
  }
  return isDxChart(chartType) ? songName + "[dx]" : songName;
}

function getSongProperties(
  songPropsByName: Map<string, ReadonlyArray<SongProperties>>,
  songName: string,
  genre: string,
  chartType: string
) {
  let songPropsArray = songPropsByName.get(songName);
  if (songPropsArray && songPropsArray.length > 0) {
    if (songPropsArray.length > 1) {
      // Song has multiple charts
      const isDX = isDxChart(chartType) ? 1 : 0;
      songPropsArray = songPropsArray.filter(d => d.dx === isDX);
      if (songPropsArray.length > 1) {
        // Duplicate song names
        const nickname = getSongNickname(songName, genre);
        songPropsArray = songPropsArray.filter(d => d.nickname === nickname);
      }
    }
    if (songPropsArray.length === 1) {
      return songPropsArray[0];
    }
  }
  console.warn(`Could not find song properties for ${songName}`);
  return null;
}

/**
 * Compute rating value based on the chart level and player achievement.
 * If we don't find the inner level for the chart, use its estimated level and move on.
 */
function analyzeSongRating(record: ChartRecord, songProps?: SongProperties): ChartRecordWithRating {
  if (songProps) {
    const lvIndex = DIFFICULTIES.indexOf(record.difficulty);
    const lv = songProps.lv[lvIndex];
    if (typeof lv === "number") {
      record.levelIsEstimate = lv < 0;
      record.level = Math.abs(lv);
    }
  }
  if (record.levelIsEstimate) {
    const debugName = (
      getSongNickname(record.songName, record.genre, record.chartType)
      + " - " + record.difficulty + " " + record.level
    );
    console.warn(`Missing inner lv data for ${debugName}`);
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
) {
  const newSongScores = [];
  const oldSongScores = [];
  for (const record of playerScores) {
    const songProps = getSongProperties(
      songPropsByName,
      record.songName,
      record.genre,
      record.chartType
    );
    let isOldChart = record.chartType === "STANDARD";
    if (songProps) {
      // can differentiate between DX & DX Plus
      isOldChart = songProps.debut !== gameVersion;
    }
    const recordWithRating = analyzeSongRating(record, songProps);
    if (isOldChart) {
      oldSongScores.push(recordWithRating);
    } else {
      newSongScores.push(recordWithRating);
    }
  }

  newSongScores.sort(compareSongsByRating);
  oldSongScores.sort(compareSongsByRating);

  let newChartsRating = 0;
  const newTopChartsCount = Math.min(NUM_TOP_NEW_SONGS, newSongScores.length);
  for (let i = 0; i < newTopChartsCount; i++) {
    newChartsRating += Math.floor(newSongScores[i].rating);
  }

  let oldChartsRating = 0;
  const oldTopChartsCount = Math.min(NUM_TOP_OLD_SONGS, oldSongScores.length);
  for (let i = 0; i < oldTopChartsCount; i++) {
    oldChartsRating += Math.floor(oldSongScores[i].rating);
  }

  return {
    newSongScores,
    newChartsRating,
    newTopChartsCount,
    oldSongScores,
    oldChartsRating,
    oldTopChartsCount,
  };
}
