export const DIFFICULTIES = [
  "BASIC", "ADVANCED", "EXPERT", "MASTER", "Re:MASTER"
];

export const DIFFICULTY_CLASSNAME_MAP = new Map([
  ["Re:MASTER", "remaster"],
  ["MASTER", "master"],
  ["EXPERT", "expert"],
  ["ADVANCED", "advanced"],
]);

const MAX_CHART_LEVEL = 15;
export const OFFICIAL_LEVELS = [];
for (let i = MAX_CHART_LEVEL; i >= 1; i--) {
  if (i !== MAX_CHART_LEVEL) {
    OFFICIAL_LEVELS.push(i + "+");
  }
  OFFICIAL_LEVELS.push(i.toString());
}

export const SSSPLUS_MIN_ACHIEVEMENT = 100.5;
export const DX_GAME_VERSION = 13;
export const DX_PLUS_GAME_VERSION = 14;
