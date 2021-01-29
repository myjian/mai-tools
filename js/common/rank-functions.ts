export interface RankDef {
  th: number;
  factor: number;
  title: string;
}

const RANK_DEFINITIONS_PLUS: ReadonlyArray<RankDef> = [
  {th: 100.50, factor: 14, title: "SSS+"},
  {th: 100.00, factor: 13.5, title: "SSS"},
  {th: 99.50, factor: 13.2, title: "SS+"},
  {th: 99.00, factor: 13, title: "SS"},
  {th: 98.00, factor: 12.7, title: "S+"},
  {th: 97.00, factor: 12.5, title: "S"},
  {th: 94.00, factor: 10.5, title: "AAA"},
  {th: 90.00, factor: 9.5, title: "AA"},
  {th: 80.00, factor: 8.5, title: "A"},
  {th: 75.00, factor: 7.5, title: "BBB"},
  {th: 70.00, factor: 7, title: "BB"},
  {th: 60.00, factor: 6, title: "B"},
  {th: 50.00, factor: 5, title: "C"},
];

export function getRankDefinitions() {
  return RANK_DEFINITIONS_PLUS;
}

export function getRankIndexByAchievement(achievement: number) {
  return getRankDefinitions().findIndex((rank) => {
    return achievement >= rank.th;
  });
}

export function getRankByAchievement(achievement: number) {
  const idx = getRankIndexByAchievement(achievement);
  return idx < 0 ? null : getRankDefinitions()[idx];
}

export function getRankTitle(achievement: number) {
  const rankDef = getRankByAchievement(achievement);
  return rankDef ? rankDef.title : "C";
}

export function getFinaleRankTitle(achievement: number) {
  return getRankTitle(achievement).replace("SSS+", "SSS");
}
