import {DIFFICULTIES} from './shared-constants';
import {ChartRecord, ChartRecordWithRating, RankDef} from './types';

type RecordNumberProp = "rating" | "level" | "achievement";
type RecordStringProp = "songName";

function compareNumbers(x: number, y: number) {
  return x > y ? -1 : Number(x < y);
}

function compareSongsByStrAttr(
  a: ChartRecord,
  b: ChartRecord,
  f: RecordStringProp
) {
  return a[f].localeCompare(b[f]);
}

function compareSongsByNumAttr(
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
    compareSongsByNumAttr(record1, record2, "rating") ||
    compareSongsByNumAttr(record1, record2, "level") ||
    compareSongsByNumAttr(record1, record2, "achievement")
  );
}

export function getCandidateComparator(minRating: number) {
  return (record1: ChartRecordWithRating, record2: ChartRecordWithRating) => {
    const nextRating1 = record1.nextRanks.values().next().value;
    const costPerformance1 =
      (nextRating1.minRt - minRating) / (nextRating1.rank.th - record1.achievement);
    const nextRating2 = record2.nextRanks.values().next().value;
    const costPerformance2 =
      (nextRating2.minRt - minRating) / (nextRating2.rank.th - record2.achievement);
    return (
      compareNumbers(costPerformance1, costPerformance2) ||
      compareNumbers(nextRating1.minRt, nextRating2.minRt) ||
      compareSongsByNumAttr(record1, record2, "level")
    );
  };
}

export function compareSongsByNextRating(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating
) {
  const nextRating1 = record1.nextRanks.values().next().value;
  const nextRating2 = record2.nextRanks.values().next().value;
  return (
    compareNumbers(nextRating1.minRt, nextRating2.minRt) ||
    compareSongsByNumAttr(record1, record2, "level")
  );
}

export function compareSongsByLevel(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating
) {
  return compareSongsByNumAttr(record1, record2, "level");
}

export function compareSongsByAchv(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating
) {
  return compareSongsByNumAttr(record1, record2, "achievement");
}

export function compareSongsByName(
  record1: ChartRecord,
  record2: ChartRecord
) {
  return compareSongsByStrAttr(record1, record2, "songName");
}

export function compareSongsByNextRank(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating
) {
  const nextRank1: RankDef = record1.nextRanks.values().next().value.rank;
  const nextRank2: RankDef = record2.nextRanks.values().next().value.rank;
  return compareNumbers(nextRank1.th, nextRank2.th);
}

export function compareSongsByDifficulty(
  record1: ChartRecordWithRating,
  record2: ChartRecordWithRating,
) {
  const dIdx1 = DIFFICULTIES.indexOf(record1.difficulty);
  const dIdx2 = DIFFICULTIES.indexOf(record2.difficulty);
  return compareNumbers(dIdx1, dIdx2);
}
