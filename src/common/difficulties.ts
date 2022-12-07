export const enum Difficulty {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ReMASTER = 4,
}

export const DIFFICULTIES = ["BASIC", "ADVANCED", "EXPERT", "MASTER", "Re:MASTER"];

export const DIFFICULTY_CLASSNAME_MAP = new Map([
  ["Re:MASTER", "remaster"],
  ["MASTER", "master"],
  ["EXPERT", "expert"],
  ["ADVANCED", "advanced"],
]);

export function getDifficultyName(diff: Difficulty): string {
  return DIFFICULTIES[diff];
}
