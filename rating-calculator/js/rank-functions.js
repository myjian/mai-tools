import {RANK_DEFINITIONS} from './shared-constants.js';

export function getRankTitle(achievement) {
  for (const rankDef of RANK_DEFINITIONS) {
    if (achievement >= rankDef.th) {
      return rankDef.title;
    }
  }
  return "C";
}

export function getRatingFactor(r, isDxPlus) {
  return isDxPlus ? r.factorPlus : r.factor;
}
