export const BASE_SCORE_PER_TYPE = {
  tap: 500,
  hold: 1000,
  touch: 500,
  slide: 1500,
  break: 2500
};
export const BREAK_BONUS_POINTS = 100;
export const MAX_BREAK_POINTS = BASE_SCORE_PER_TYPE.break + BREAK_BONUS_POINTS;
