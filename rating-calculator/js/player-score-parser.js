function getScoreMultiplier(achievement) {
  // If larger than 100.50, use 100.50.
  achievement = Math.min(achievement, RANK_DEFINITIONS[0].th);
  for (const rankDef of RANK_DEFINITIONS) {
    if (achievement >= rankDef.th) {
      return {
        factor: rankDef.factor,
        multiplier: achievement * rankDef.factor / 100,
      };
    }
  }
  console.warn(`Could not find score multiplier for achievement ${achievement.toFixed(4)}%`);
  return {factor: 5, multiplier: achievement * 5 / 100};
}

function parseScoreLine(line) {
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
    const scoreMultiplier = getScoreMultiplier(achievement);
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
