import {SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {getRankDefinitions, getRankIndexByAchievement} from '../common/rank-functions';
import {calculateRatingRange} from './rating-functions';
import {compareCandidate} from './record-comparator';
import {ChartRecordWithRating} from './types';

// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

function getNextRating(record: ChartRecordWithRating, ratingThreshold: number) {
  const rankDefIdx = getRankIndexByAchievement(record.achievement);
  const ratingByRank = new Map();
  if (rankDefIdx <= 0) {
    return ratingByRank;
  }
  const rankDefs = getRankDefinitions();
  for (let i = rankDefIdx - 1; i >= 0; i--) {
    const rank = rankDefs[i];
    if (rank.title === rankDefs[i + 1].title) {
      continue;
    }
    const [minRt] = calculateRatingRange(record.level, rank);
    if (minRt > ratingThreshold) {
      ratingByRank.set(rank.title, {minRt: minRt - ratingThreshold, rank});
      if (ratingByRank.size >= 2) {
        break;
      }
    }
  }
  return ratingByRank;
}

export function getCandidateSongs(
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
      const ratingByRank = getNextRating(record, Math.floor(record.rating));
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
      const ratingByRank = getNextRating(record, minRating);
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
