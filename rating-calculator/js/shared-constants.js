const DIFFICULTIES = [
  "BASIC", "ADVANCED", "EXPERT", "MASTER", "Re:MASTER"
];

const DIFFICULTY_CLASSNAME_MAP = new Map([
  ["Re:MASTER", "remaster"],
  ["MASTER", "master"],
  ["EXPERT", "expert"],
  ["ADVANCED", "advanced"],
]);

// threshold, factor, rank
const RANK_DEFINITIONS = [
  {th: 100.50, factor: 15, factorPlus: 14, title: "SSS+"},
  {th: 100.00, factor: 14, factorPlus: 13.5, title: "SSS"},
  {th: 99.99, factor: 13.5, factorPlus: 13.2, title: "SS+"},
  {th: 99.50, factor: 13, factorPlus: 13.2, title: "SS+"},
  {th: 99.00, factor: 12, factorPlus: 13, title: "SS"},
  {th: 98.00, factor: 11, factorPlus: 12.7, title: "S+"},
  {th: 97.00, factor: 10, factorPlus: 12.5, title: "S"},
  {th: 94.00, factor: 9.4, factorPlus: 10.5, title: "AAA"},
  {th: 90.00, factor: 9, factorPlus: 9.5, title: "AA"},
  {th: 80.00, factor: 8, factorPlus: 8.5, title: "A"},
  {th: 75.00, factor: 7.5, factorPlus: 7.5, title: "BBB"},
  {th: 70.00, factor: 7, factorPlus: 7, title: "BB"},
  {th: 60.00, factor: 6, factorPlus: 6, title: "B"},
  {th: 50.00, factor: 5, factorPlus: 5, title: "C"},
];

const MAX_CHART_LEVEL = 15;
const OFFICIAL_LEVELS = [];
for (let i = MAX_CHART_LEVEL; i >= 1; i--) {
  if (i !== MAX_CHART_LEVEL) {
    OFFICIAL_LEVELS.push(i + "+");
  }
  OFFICIAL_LEVELS.push(i.toString());
}
