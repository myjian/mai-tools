import {DX_SPLASH_GAME_VERSION} from './constants';

export interface RankDef {
  minAchv: number;
  factor: number;
  title: string;
}

const RANK_DEFINITIONS: ReadonlyArray<RankDef> = [
  {minAchv: 100.5, factor: 14, title: "SSS+"},
  {minAchv: 100.0, factor: 13.5, title: "SSS"},
  {minAchv: 99.5, factor: 13.2, title: "SS+"},
  {minAchv: 99.0, factor: 13, title: "SS"},
  {minAchv: 98.0, factor: 12.7, title: "S+"},
  {minAchv: 97.0, factor: 12.5, title: "S"},
  {minAchv: 94.0, factor: 10.5, title: "AAA"},
  {minAchv: 90.0, factor: 9.5, title: "AA"},
  {minAchv: 80.0, factor: 8.5, title: "A"},
  {minAchv: 75.0, factor: 7.5, title: "BBB"},
  {minAchv: 70.0, factor: 7, title: "BB"},
  {minAchv: 60.0, factor: 6, title: "B"},
  {minAchv: 50.0, factor: 5, title: "C"},
];

export const RANK_DEFINITIONS_SPLASH_PLUS: ReadonlyArray<RankDef> = RANK_DEFINITIONS.map((r) => ({
  minAchv: r.minAchv,
  factor: r.factor * 1.6,
  title: r.title,
}));

export function getRankDefinitions(gameVer: number) {
  return gameVer > DX_SPLASH_GAME_VERSION ? RANK_DEFINITIONS_SPLASH_PLUS : RANK_DEFINITIONS;
}

export function getRankIndexByAchievement(achievement: number) {
  return RANK_DEFINITIONS.findIndex((rank) => {
    return achievement >= rank.minAchv;
  });
}

export function getRankByAchievement(achievement: number, gameVer: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? null : getRankDefinitions(gameVer)[idx];
}

export function getRankTitle(achievement: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? "D" : RANK_DEFINITIONS[idx].title;
}

export function getFinaleRankTitle(achievement: number) {
  return getRankTitle(achievement).replace("SSS+", "SSS");
}
