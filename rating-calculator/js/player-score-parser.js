// threshold, factor, rank
const RANK_FACTORS = [
  [100.50, 15, "SSS+"],
  [100.00, 14, "SSS"],
  [99.99, 13.5, "SS+"],
  [99.50, 13, "SS+"],
  [99.00, 12, "SS"],
  [98.00, 11, "S+"],
  [97.00, 10, "S"],
  [94.00, 9.4, "AAA"],
  [90.00, 9, "AA"],
  [80.00, 8, "A"],
  [75.00, 7.5, "BBB"],
  [70.00, 7, "BB"],
  [60.00, 6, "B"],
  [50.00, 5, "C"],
];

function getScoreMultiplier(achievement) {
  // If larger than 100.50, use 100.50.
  achievement = Math.min(achievement, RANK_FACTORS[0][0]);
  for (const [minAc, factor, rank] of RANK_FACTORS) {
    if (achievement >= minAc) {
      return {factor: factor, multiplier: achievement * factor / 100};
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
