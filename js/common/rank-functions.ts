export interface RankDef {
  th: number;
  factor: number;
  title: string;
}

export const RANK_DEFINITIONS: ReadonlyArray<RankDef> = [
  {th: 100.5, factor: 14, title: "SSS+"},
  {th: 100.0, factor: 13.5, title: "SSS"},
  {th: 99.5, factor: 13.2, title: "SS+"},
  {th: 99.0, factor: 13, title: "SS"},
  {th: 98.0, factor: 12.7, title: "S+"},
  {th: 97.0, factor: 12.5, title: "S"},
  {th: 94.0, factor: 10.5, title: "AAA"},
  {th: 90.0, factor: 9.5, title: "AA"},
  {th: 80.0, factor: 8.5, title: "A"},
  {th: 75.0, factor: 7.5, title: "BBB"},
  {th: 70.0, factor: 7, title: "BB"},
  {th: 60.0, factor: 6, title: "B"},
  {th: 50.0, factor: 5, title: "C"},
];

export function getRankIndexByAchievement(achievement: number) {
  return RANK_DEFINITIONS.findIndex((rank) => {
    return achievement >= rank.th;
  });
}

export function getRankByAchievement(achievement: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? null : RANK_DEFINITIONS[idx];
}

export function getRankTitle(achievement: number) {
  const rankDef = getRankByAchievement(achievement);
  return rankDef ? rankDef.title : "C";
}

export function getFinaleRankTitle(achievement: number) {
  return getRankTitle(achievement).replace("SSS+", "SSS");
}
