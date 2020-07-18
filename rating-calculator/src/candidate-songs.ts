import {getRankDefinitions, getRankIndexByAchievement} from './rank-functions';
import {calculateRatingRange} from './rating-functions';
import {getSongsByNextRatingComparator} from './record-comparator';
import {SSSPLUS_MIN_ACHIEVEMENT} from './shared-constants';
import {ChartRecordWithRating} from './types';

const CANDIDATE_SONGS_POOL_COUNT = 50;
const CANDIDATE_SONGS_COUNT = 20;
const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

function getNextRating(record: ChartRecordWithRating, isDxPlus: boolean, ratingThreshold: number) {
  const rankDefIdx = getRankIndexByAchievement(record.achievement, isDxPlus);
  const ratingByRank = new Map();
  if (rankDefIdx <= 0) {
    return ratingByRank;
  }
  const rankDefs = getRankDefinitions(isDxPlus);
  for (let i = rankDefIdx - 1; i >= 0 ; i--) {
    const rank = rankDefs[i];
    if (rank.title === rankDefs[i+1].title) {
      continue;
    }
    const [minRt, maxRt] = calculateRatingRange(record.level, rank, isDxPlus);
    if (maxRt >= ratingThreshold) {
      ratingByRank.set(rank.title, {minRt, rank});
    }
  }
  return ratingByRank;
}

export function getCandidateSongs(records: ReadonlyArray<ChartRecordWithRating>, startIndex: number, isDxPlus: boolean) {
  const candidates: ChartRecordWithRating[] = [];
  if (startIndex <= 0) {
    return candidates;
  }
  const minRating = records[startIndex-1].rating;
  for (let i = startIndex; i < records.length; i++) {
    const record = records[i]
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(record, isDxPlus, minRating);
      if (!ratingByRank.size) {
        continue;
      }
      record.nextRanks = ratingByRank;
      candidates.push(record);
      if (candidates.length >= CANDIDATE_SONGS_POOL_COUNT) {
        break;
      }
    }
  }
  candidates.sort(getSongsByNextRatingComparator(minRating - MIN_RATING_ADJUSTMENT));
  return candidates.slice(0, CANDIDATE_SONGS_COUNT);
}
