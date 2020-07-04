import {RANK_DEFINITIONS} from './shared-constants.js';

export function getRatingFactor(rank, isDxPlus) {
  return isDxPlus ? rank.factorPlus : rank.factor;
}

export function getRankDefinitionIndex(achievement) {
  return RANK_DEFINITIONS.findIndex((rank) => {
    return achievement >= rank.th;
  });
}

export function getRankDefinition(achievement) {
  const idx = getRankDefinitionIndex(achievement);
  return idx < 0 ? null : RANK_DEFINITIONS[idx];
}

export function getRankTitle(achievement) {
  const rankDef = getRankDefinition(achievement);
  return rankDef ? rankDef.title : "C";
}
