import {getRankDefinitions, getRankIndexByAchievement} from './rank-functions.js';
import {calculateRatingRange} from './rating-functions.js';
import {compareSongsByNextRating} from './record-comparator.js';
import {SSSPLUS_MIN_ACHIEVEMENT} from './shared-constants.js';

const CANDIDATE_SONGS_COUNT = 20;

function getNextRating(record, isDxPlus) {
  const rankDefIdx = getRankIndexByAchievement(record.achievement);
  if (rankDefIdx <= 0) {
    return [record.rating, record.achievement];
  }
  const rankDefs = getRankDefinitions(isDxPlus);
  const ratingByRank = new Map();
  for (let i = rankDefIdx - 1; i >= 0 ; i--) {
    const rank = rankDefs[i];
    if (rank.title === rankDefs[i+1].title) {
      continue;
    }
    const [minRt, maxRt] = calculateRatingRange(record.innerLv, rank, isDxPlus);
    ratingByRank.set(rank.title, minRt);
  }
  return ratingByRank;
}

export function getCandidateSongs(songScores, startIndex, isDxPlus) {
  const candidates = [];
  for (let i = startIndex; i < songScores.length; i++) {
    const record = songScores[i]
    if (record.achievement < SSSPLUS_MIN_ACHIEVEMENT) {
      const ratingByRank = getNextRating(record, isDxPlus);
      record.nextRanks = ratingByRank;
      candidates.push(record);
      if (candidates.length >= CANDIDATE_SONGS_COUNT) {
        break;
      }
    }
  }
  //candidates.sort(compareSongsByNextRating);
  return candidates;
}
