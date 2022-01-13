import {shuffleArray} from '../common/array-util';
import {DIFFICULTIES, DxVersion, SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {
  getRankByAchievement,
  getRankDefinitions,
  getRankIndexByAchievement,
} from '../common/rank-functions';
import {getSongNickname} from '../common/song-name-helper';
import {SongProperties} from '../common/song-props';
import {calculateRatingRange} from './rating-functions';
import {compareCandidate, compareSongsByLevel} from './record-comparator';
import {ChartRecordWithRating} from './types';

// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

type NextRatingCandidate = Pick<ChartRecordWithRating, "achievement" | "level">;

function getNextRating(
  gameVer: DxVersion,
  record: NextRatingCandidate,
  ratingRangeMin: number,
  numOfRanks: number
) {
  let rankDefIdx = getRankIndexByAchievement(record.achievement);
  if (rankDefIdx === -1) {
    rankDefIdx = getRankIndexByAchievement(94);
  }
  const ranks = getRankDefinitions(gameVer);
  const ratingByRank = new Map();
  for (let i = rankDefIdx - 1; i >= 0; i--) {
    const rank = ranks[i];
    if (rank.title === ranks[i + 1].title) {
      continue;
    }
    const [minRt] = calculateRatingRange(gameVer, record.level, rank);
    if (minRt > ratingRangeMin) {
      ratingByRank.set(rank.title, {minRt: minRt - ratingRangeMin, rank});
      if (ratingByRank.size >= numOfRanks) {
        break;
      }
    }
  }
  return ratingByRank;
}

export function getCandidateCharts(
  gameVer: DxVersion,
  records: ReadonlyArray<ChartRecordWithRating>,
  topCount: number,
  count: number
) {
  const candidates: ChartRecordWithRating[] = [];
  if (topCount <= 0) {
    return candidates;
  }
  for (let i = 0; i < topCount; i++) {
    const record = records[i];
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(gameVer, record, Math.floor(record.rating), 2);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
    }
  }
  const minRating = Math.floor(records[topCount - 1].rating);
  for (let i = topCount; i < records.length; i++) {
    const record = records[i];
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(gameVer, record, minRating, 2);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
      if (candidates.length >= count) {
        break;
      }
    }
  }
  candidates.sort(compareCandidate);
  return candidates;
}

export function getNotPlayedCharts(
  gameVer: DxVersion,
  songList: ReadonlyArray<SongProperties>,
  records: ReadonlyArray<ChartRecordWithRating>,
  topCount: number,
  count: number
) {
  const playedCharts = new Set<string>();
  for (const r of records) {
    const key = getSongNickname(r.songName, r.genre, r.chartType);
    playedCharts.add(key + r.difficulty);
  }
  const maxRating = records.length ? Math.ceil(records[0].rating) : 0;
  const minRating = records.length ? Math.floor(records[topCount - 1].rating) : 0;
  const maxRank = getRankByAchievement(100.5, gameVer);
  const minRank = getRankByAchievement(97, gameVer);
  const hardestLv = maxRating ? (maxRating * 100) / (minRank.factor * minRank.minAchv) : 15;
  const easiestLv = (minRating * 100) / (maxRank.factor * maxRank.minAchv);
  const candidates: ChartRecordWithRating[] = [];
  const shuffledSongList = shuffleArray(songList);
  console.log(`rating range is ${minRating} - ${maxRating}`);
  console.log(`lv limited to ${easiestLv} - ${hardestLv}`);
  for (const s of shuffledSongList) {
    // index 1 means ADVANCED (skip BASIC)
    for (let index = 1; index < s.lv.length; index++) {
      let lv = s.lv[index];
      const levelIsEstimate = lv < 0;
      lv = Math.abs(lv);
      const key = s.name === "Link" ? s.nickname : getSongNickname(s.name, "", s.dx);
      // Math.min is hack for newly added Re:MASTER charts.
      // I think the hack is no longer needed as I made parseSongProperties check lv array length,
      // but just want to stay safe.
      const diff = DIFFICULTIES[Math.min(index, DIFFICULTIES.length - 1)];
      if (playedCharts.has(key + diff) || lv < easiestLv || lv > hardestLv) {
        continue; // skip played, too easy, or too hard charts
      }
      const record: ChartRecordWithRating = {
        songName: s.name,
        difficulty: diff,
        level: lv,
        levelIsEstimate,
        genre: "",
        chartType: s.dx,
        rating: 0,
        achievement: 0,
      };
      const ratingByRank = getNextRating(gameVer, record, minRating, 1);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
    }
    if (candidates.length >= count) {
      break;
    }
  }
  candidates.sort(compareSongsByLevel);
  return candidates;
}
