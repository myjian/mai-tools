function compareNumbers(x, y) {
  return x > y ? -1 : Number(x < y);
}

function compareSongsByAttr(a, b, f) {
  return compareNumbers(a[f], b[f]);
}

export function compareSongsByRating(record1, record2) {
  return (
    compareSongsByAttr(record1, record2, "rating")
    || compareSongsByAttr(record1, record2, "innerLv")
    || compareSongsByAttr(record1, record2, "achievement")
  );
}

export function getSongsByNextRatingComparator(minRating) {
  return (record1, record2) => {
    const nextRating1 = record1.nextRanks.values().next().value;
    const costPerformance1 = (nextRating1.minRt - minRating) / (nextRating1.rank.th - record1.achievement);
    const nextRating2 = record2.nextRanks.values().next().value;
    const costPerformance2 = (nextRating2.minRt - minRating) / (nextRating2.rank.th - record2.achievement);
    return (
      compareNumbers(costPerformance1, costPerformance2)
      || compareSongsByAttr(record1, record2, "nextRating")
      || compareSongsByAttr(record1, record2, "innerLv")
    );
  };
}
