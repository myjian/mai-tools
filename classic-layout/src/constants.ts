import {BreakScore, BreakScoreMap, JudgementType, NoteType, StrictJudgementType} from './types';

export const DX_NOTE_TYPES: ReadonlyArray<NoteType> = ["tap", "hold", "slide", "touch", "break"];

export const BASE_SCORE_PER_TYPE: Readonly<{[t in NoteType]: number}> = {
  tap: 500,
  hold: 1000,
  touch: 500,
  slide: 1500,
  break: 2500
};
export const REGULAR_BASE_SCORE_MULTIPLIER: {[j in StrictJudgementType]: number} =
  {cp: 1, perfect: 1, great: 0.8, good: 0.5, miss: 0};
export const BREAK_BONUS_POINTS = 100;
export const MAX_BREAK_POINTS = (BASE_SCORE_PER_TYPE.break + BREAK_BONUS_POINTS) as BreakScore;
export const BREAK_BASE_SCORE_MULTIPLIER: Readonly<BreakScoreMap> = new Map([
  [MAX_BREAK_POINTS, 1],
  [2550, 1],
  [2500, 1],
  [2000, 0.8],
  [1500, 0.6],
  [1250, 0.5],
  [1000, 0.4],
  [0, 0]
]);
export const BREAK_BONUS_MULTIPLIER: Readonly<BreakScoreMap> = new Map([
  [MAX_BREAK_POINTS, 1],
  [2550, 0.75],
  [2500, 0.5],
  [2000, 0.4],
  [1500, 0.4],
  [1250, 0.4],
  [1000, 0.3],
  [0, 0]
]);

export const EMPTY_JUDGEMENT_OBJ: {[t in JudgementType]: number} = {
  perfect: 0,
  great: 0,
  good: 0,
  miss: 0,
};

export const enum DisplayMode {
  NORMAL = "NORMAL",
  DETAIL = "DETAIL",
  LOSS = "LOSS",
}
