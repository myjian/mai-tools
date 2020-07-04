function compareSongsByAttr(a, b, f) {
  return a[f] > b[f] ? -1 : Number(a[f] < b[f]);
}

export function compareSongsByRating(record1, record2) {
  return (
    compareSongsByAttr(record1, record2, "rating")
    || compareSongsByAttr(record1, record2, "innerLv")
    || compareSongsByAttr(record1, record2, "achievement")
  );
}

export function compareSongsByNextRating(record1, record2) {
  return (
    compareSongsByAttr(record1, record2, "nextRating")
    || compareSongsByAttr(record1, record2, "innerLv")
  );
}
