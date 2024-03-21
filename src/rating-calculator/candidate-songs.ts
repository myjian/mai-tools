import {shuffleArray} from '../common/array-util';
import {DIFFICULTIES} from '../common/difficulties';
import {LevelDef} from '../common/level-helper';
import {
  getRankDefinitions,
  getRankIndexByAchievement,
  RANK_S,
  RANK_SSS_PLUS,
} from '../common/rank-functions';
import {calculateRatingRange} from '../common/rating-functions';
import {getSongNicknameWithChartType} from '../common/song-name-helper';
import {SongProperties} from '../common/song-props';
import {compareCandidate, compareSongsByLevel} from './record-comparator';
import {ChartRecordWithRating} from './types';

// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

const LOWEST_RANK_FOR_CANDIDATE = getRankIndexByAchievement(94);

type NextRatingCandidate = Pick<ChartRecordWithRating, 'achievement' | 'level'>;

function getNextRating(record: NextRatingCandidate, lowestRating: number, numOfRanks: number) {
  // Choose the higher one (if 50% vs 94%, choose 94%; if 98% vs 94%. choose 98%)
  let rankDefIdx = Math.min(
    getRankIndexByAchievement(record.achievement),
    LOWEST_RANK_FOR_CANDIDATE
  );
  const ranks = getRankDefinitions();
  const ratingByRank = new Map();
  for (let i = rankDefIdx - 1; i >= 0; i--) {
    const rank = ranks[i];
    if (rank.title === ranks[i + 1].title) {
      continue;
    }
    const [minRt] = calculateRatingRange(record.level, rank);
    if (minRt > lowestRating) {
      ratingByRank.set(rank.title, {minRt: minRt - lowestRating, rank});
      if (ratingByRank.size >= numOfRanks) {
        break;
      }
    }
  }
  return ratingByRank;
}

export function getCandidateCharts(
  records: ReadonlyArray<ChartRecordWithRating>,
  topCount: number,
  count: number,
  requiredLv?: LevelDef
) {
  const candidates: ChartRecordWithRating[] = [];
  if (topCount <= 0) {
    return candidates;
  }
  for (let i = 0; i < topCount; i++) {
    const record = records[i];
    if (record.achievement >= RANK_SSS_PLUS.minAchv) continue;
    if (requiredLv && (record.level < requiredLv.minLv || record.level > requiredLv.maxLv))
      continue;
    record.nextRanks = getNextRating(record, Math.floor(record.rating), 2);
    candidates.push(record);
  }
  const minRating = Math.floor(records[topCount - 1].rating);
  for (let i = topCount; i < records.length; i++) {
    const record = records[i];
    if (record.achievement >= RANK_SSS_PLUS.minAchv) continue;
    if (requiredLv && (record.level < requiredLv.minLv || record.level > requiredLv.maxLv))
      continue;
    const ratingByRank = getNextRating(record, minRating, 2);
    if (!ratingByRank.size) {
      continue;
    }
    record.nextRanks = ratingByRank;
    candidates.push(record);
    if (candidates.length >= count) {
      break;
    }
  }
  candidates.sort(compareCandidate);
  return candidates;
}

/**
 * @param songList List of all available songs
 * @param records Played charts
 * @param count Number of not played charts to return
 * @param requiredLv Required level (choose only charts of this level)
 */
export function getNotPlayedCharts(
  songList: ReadonlyArray<SongProperties>,
  records: ReadonlyArray<ChartRecordWithRating>,
  minRating: number,
  count: number,
  requiredLv?: LevelDef
) {
  const playedCharts = new Set<string>();
  for (const r of records) {
    const key = getSongNicknameWithChartType(r.songName, r.genre, r.chartType);
    playedCharts.add(key + r.difficulty);
  }
  const maxRating = records.length ? Math.ceil(records[0].rating) : 0;
  const hardestLv = requiredLv
    ? requiredLv.maxLv
    : maxRating
    ? (maxRating * 100) / (RANK_S.factor * RANK_S.minAchv)
    : 15;
  const easiestLv = requiredLv
    ? requiredLv.minLv
    : (minRating * 100) / (RANK_SSS_PLUS.factor * RANK_SSS_PLUS.minAchv);
  const candidates: ChartRecordWithRating[] = [];
  const shuffledSongList = shuffleArray(songList);
  for (const s of shuffledSongList) {
    // index 1 means ADVANCED (skip BASIC)
    for (let index = 1; index < s.lv.length; index++) {
      let lv = s.lv[index];
      const levelIsPrecise = lv > 0;
      lv = Math.abs(lv);
      const key = getSongNicknameWithChartType(s.name === 'Link' ? s.nickname : s.name, '', s.dx);
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
        levelIsPrecise,
        genre: '',
        chartType: s.dx,
        rating: 0,
        achievement: 0,
      };
      const ratingByRank = getNextRating(record, minRating, 1);
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
