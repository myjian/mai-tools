import {MAX_LEVEL} from './level-helper';
import {roundFloat} from './number-helper';

export interface RankDef {
  minAchv: number;
  factor: number;
  title: string;
}

export const SSSPLUS_MIN_ACHIEVEMENT = 100.5;

const RANK_DEFINITIONS: ReadonlyArray<RankDef> = [
  {minAchv: 100.5, factor: 22.4, title: 'SSS+'},
  {minAchv: 100.0, factor: 21.6, title: 'SSS'},
  {minAchv: 99.5, factor: 21.1, title: 'SS+'},
  {minAchv: 99.0, factor: 20.8, title: 'SS'},
  {minAchv: 98.0, factor: 20.3, title: 'S+'},
  {minAchv: 97.0, factor: 20, title: 'S'},
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

export function calcRecommendedLv(rating: number, r: RankDef): number {
  const lv = roundFloat((100 * rating) / r.factor / r.minAchv, 'ceil', 0.1);
  return lv > MAX_LEVEL ? -1 : lv;
}
