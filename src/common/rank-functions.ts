import {MAX_LEVEL} from './level-helper';
import {roundFloat} from './number-helper';

export interface RankDef {
  minAchv: number;
  factor: number;
  title: string;
}

export interface RecommendedLevel {
  lv: number;
  minAchv: number;
  rating: number;
}

export const RANK_S: RankDef = {
  minAchv: 97.0,
  factor: 20,
  title: 'S',
};

export const RANK_SSS_PLUS: RankDef = {
  minAchv: 100.5,
  factor: 22.4,
  title: 'SSS+',
};

const RANK_DEFINITIONS: ReadonlyArray<RankDef> = [
  RANK_SSS_PLUS,
  {minAchv: 100.0, factor: 21.6, title: 'SSS'},
  {minAchv: 99.5, factor: 21.1, title: 'SS+'},
  {minAchv: 99.0, factor: 20.8, title: 'SS'},
  {minAchv: 98.0, factor: 20.3, title: 'S+'},
  RANK_S,
  {minAchv: 94.0, factor: 16.8, title: 'AAA'},
  {minAchv: 90.0, factor: 15.2, title: 'AA'},
  {minAchv: 80.0, factor: 13.6, title: 'A'},
  {minAchv: 75.0, factor: 12, title: 'BBB'},
  {minAchv: 70.0, factor: 11.2, title: 'BB'},
  {minAchv: 60.0, factor: 9.6, title: 'B'},
  {minAchv: 50.0, factor: 8, title: 'C'},
  {minAchv: 0.0, factor: 1, title: 'D'},
];

export function getRankDefinitions() {
  return RANK_DEFINITIONS;
}

export function getRankIndexByAchievement(achievement: number) {
  return RANK_DEFINITIONS.findIndex((rank) => {
    return achievement >= rank.minAchv;
  });
}

export function getRankByAchievement(achievement: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? null : getRankDefinitions()[idx];
}

export function getRankTitle(achievement: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? 'D' : RANK_DEFINITIONS[idx].title;
}

export function getFinaleRankTitle(achievement: number) {
  return getRankTitle(achievement).replace('SSS+', 'SSS');
}

/** Returns recommended levels by rank title */
export function calcRecommendedLevels(
  rating: number,
  ranks: RankDef[]
): Record<string, RecommendedLevel[]> {
  rating = Math.floor(rating);
  const ranksLowToHigh = ranks.slice();
  ranksLowToHigh.sort((r1, r2) => {
    return r1.minAchv < r2.minAchv ? -1 : 1;
  });
  const levelsByRank: Record<string, RecommendedLevel[]> = {};
  for (let rankIdx = 0; rankIdx < ranksLowToHigh.length; rankIdx++) {
    const r = ranksLowToHigh[rankIdx];
    levelsByRank[r.title] = [];
    const levels = levelsByRank[r.title];
    const maxAchv =
      rankIdx + 1 < ranksLowToHigh.length
        ? ranksLowToHigh[rankIdx + 1].minAchv - 0.0001
        : r.minAchv;
    let maxLv = roundFloat((100 * rating) / r.factor / r.minAchv, 'ceil', 0.1);
    if (maxLv > MAX_LEVEL) continue;
    /* Show another 0.1 level. This is too verbose so disable it for now */
    // const previousLevels = rankIdx > 0 ? levelsByRank[ranksLowToHigh[rankIdx - 1].title] : [];
    // if (previousLevels.length && maxLv + 0.1 < previousLevels[previousLevels.length - 1].lv) {
    //   maxLv += 0.1;
    // }
    while (Math.floor((maxLv * r.factor * maxAchv) / 100) >= rating) {
      const minAchv = Math.max(
        roundFloat((100 * rating) / r.factor / maxLv, 'ceil', 0.0001),
        r.minAchv
      );
      levels.push({
        lv: maxLv,
        minAchv,
        rating: Math.floor((maxLv * r.factor * minAchv) / 100),
      });
      maxLv -= 0.1;
    }
    levels.reverse();
  }
  return levelsByRank;
}
