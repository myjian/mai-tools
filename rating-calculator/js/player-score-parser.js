function getRatingFactor(r, isDxPlus) {
  return isDxPlus ? r.factorPlus : r.factor;
}

function getScoreMultiplier(achievement, isDxPlus) {
  // If larger than 100.50, use 100.50.
  achievement = Math.min(achievement, RANK_DEFINITIONS[0].th);
  for (const r of RANK_DEFINITIONS) {
    if (achievement >= r.th) {
      const factor = getRatingFactor(r, isDxPlus);
      const multiplier = factor * achievement / 100;
      return {factor, multiplier};
    }
  }
  console.warn(`Could not find score multiplier for achievement ${achievement.toFixed(4)}%`);
  return {factor: 5, multiplier: 5 * achievement / 100};
}

function parseScoreLine(line, isDxPlus) {
  const [
    songName,
    genre,
    difficulty,
    level,
    chartType,
    achievementText,
  ] = line.split("\t");
  if (songName && genre && difficulty && level && chartType && achievementText) {
    const achievement = parseFloat(achievementText);
    const scoreMultiplier = getScoreMultiplier(achievement, isDxPlus);
    return {
      songName,
      genre,
      difficulty,
      level,
      chartType,
      achievement,
      multiplier: scoreMultiplier.multiplier,
      rankFactor: scoreMultiplier.factor,
    };
  }
}
