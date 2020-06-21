const DIFFICULTIES = [
  "BASIC", "ADVANCED", "EXPERT", "MASTER", "Re:MASTER"
];

const DIFFICULTY_CLASSNAME_MAP = new Map([
  ["Re:MASTER", "remaster"],
  ["MASTER", "master"],
  ["EXPERT", "expert"],
  ["ADVANCED", "advanced"],
]);

const MAX_CHART_LEVEL = 14;

// threshold, factor, rank
const RANK_DEFINITIONS = [
  {th: 100.50, factor: 15, title: "SSS+"},
  {th: 100.00, factor: 14, title: "SSS"},
  {th: 99.99, factor: 13.5, title: "SS+"},
  {th: 99.50, factor: 13, title: "SS+"},
  {th: 99.00, factor: 12, title: "SS"},
  {th: 98.00, factor: 11, title: "S+"},
  {th: 97.00, factor: 10, title: "S"},
  {th: 94.00, factor: 9.4, title: "AAA"},
  {th: 90.00, factor: 9, title: "AA"},
  {th: 80.00, factor: 8, title: "A"},
  {th: 75.00, factor: 7.5, title: "BBB"},
  {th: 70.00, factor: 7, title: "BB"},
  {th: 60.00, factor: 6, title: "B"},
  {th: 50.00, factor: 5, title: "C"},
];
