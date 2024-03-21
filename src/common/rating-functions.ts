import {compareNumber} from './number-helper';
import {getRankByAchievement, getRankDefinitions, RANK_SSS_PLUS, RankDef} from './rank-functions';
import {SongProperties} from './song-props';

export function calculateRatingRange(lv: number, rank: RankDef) {
  const rankDefs = getRankDefinitions();
  const idx = rankDefs.indexOf(rank);
  const maxAchv = idx >= 1 ? rankDefs[idx - 1].minAchv - 0.0001 : rank.minAchv;
  const minRating = Math.floor((lv * rank.minAchv * rank.factor) / 100);
  const maxRating = Math.floor((lv * maxAchv * rank.factor) / 100);
  return [minRating, maxRating];
}

export function calculateFullRating(songs: ReadonlyArray<SongProperties>, count: number) {
  let allLvs: number[] = [];
  for (const song of songs) {
    allLvs = allLvs.concat(
      song.lv.filter((lv) => typeof lv === 'number').map((lv) => Math.abs(lv))
    );
  }
  allLvs.sort(compareNumber);
  const topLvs = allLvs.slice(Math.max(0, allLvs.length - count));
  const topRank = RANK_SSS_PLUS;
  let totalRating = 0;
  for (const lv of topLvs) {
    totalRating += Math.floor((lv * topRank.minAchv * topRank.factor) / 100);
  }
  return totalRating;
}

export function getAvg(sum: number, count: number) {
  return count ? (sum / count).toFixed(0) : 0;
}

export function getRating(level: number, achv: number) {
  const achievement = Math.min(achv, RANK_SSS_PLUS.minAchv);
  const rank = getRankByAchievement(achievement);
  if (!rank) {
    console.warn(`Could not find rank for achievement ${achievement.toFixed(4)}%`);
  }
  return rank ? (level * rank.factor * achievement) / 100 : 0;
}
