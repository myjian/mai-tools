function getRankTitle(achievement) {
  for (const rankDef of RANK_DEFINITIONS) {
    if (achievement >= rankDef.th) {
      return rankDef.title;
    }
  }
  return "C";
}

function getRatingFactor(r, isDxPlus) {
  return isDxPlus ? r.factorPlus : r.factor;
}
