import {SSSPLUS_MIN_ACHIEVEMENT} from '../common/constants';
import {getRankDefinitions, getRankIndexByAchievement} from '../common/rank-functions';
import {calculateRatingRange} from './rating-functions';
import {compareCandidate} from './record-comparator';
import {ChartRecordWithRating} from './types';

// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak

function getNextRating(record: ChartRecordWithRating, isDxPlus: boolean, ratingThreshold: number) {
  const rankDefIdx = getRankIndexByAchievement(record.achievement, isDxPlus);
  const ratingByRank = new Map();
  if (rankDefIdx <= 0) {
    return ratingByRank;
  }
  const rankDefs = getRankDefinitions(isDxPlus);
  for (let i = rankDefIdx - 1; i >= 0; i--) {
    const rank = rankDefs[i];
    if (rank.title === rankDefs[i + 1].title) {
      continue;
    }
    const [minRt] = calculateRatingRange(record.level, rank, isDxPlus);
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
  startIndex: number,
  isDxPlus: boolean,
  count: number
) {
  const candidates: ChartRecordWithRating[] = [];
  if (startIndex <= 0) {
    return candidates;
  }
  const minRating = Math.floor(records[startIndex - 1].rating);
  for (let i = startIndex; i < records.length; i++) {
    const record = records[i];
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(record, isDxPlus, minRating);
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
