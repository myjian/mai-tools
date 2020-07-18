import {ChartRecordWithRating} from './types';

type RecordNumberProp = "rating" | "level" | "achievement";

function compareNumbers(x: number, y: number) {
  return x > y ? -1 : Number(x < y);
}

function compareSongsByAttr(
  a: ChartRecordWithRating,
  b: ChartRecordWithRating,
  f: RecordNumberProp
) {
  return compareNumbers(a[f], b[f]);
}

export function compareSongsByRating(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating
) {
  return (
    compareSongsByAttr(record1, record2, "rating") ||
    compareSongsByAttr(record1, record2, "level") ||
    compareSongsByAttr(record1, record2, "achievement")
  );
}

export function getSongsByNextRatingComparator(minRating: number) {
  return (record1: ChartRecordWithRating, record2: ChartRecordWithRating) => {
    const nextRating1 = record1.nextRanks.values().next().value;
    const costPerformance1 =
      (nextRating1.minRt - minRating) / (nextRating1.rank.th - record1.achievement);
    const nextRating2 = record2.nextRanks.values().next().value;
    const costPerformance2 =
      (nextRating2.minRt - minRating) / (nextRating2.rank.th - record2.achievement);
    return (
      compareNumbers(costPerformance1, costPerformance2) ||
      compareNumbers(nextRating1, nextRating2) ||
      compareSongsByAttr(record1, record2, "level")
    );
  };
}
