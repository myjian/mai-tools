import {ChartRecord} from '../common/chart-record';
import {RankDef} from '../common/rank-functions';

export interface ChartRecordWithRating extends ChartRecord {
  rating: number;
  nextRanks?: Map<string, {minRt: number; rank: RankDef}>;
  order?: number;
  isTarget?: boolean;
}

export interface RatingData {
  oldChartsRating: number;
  oldTopChartsCount: number;
  oldChartRecords: ChartRecordWithRating[];
  newChartsRating: number;
  newTopChartsCount: number;
  newChartRecords: ChartRecordWithRating[];
}

export const enum ColumnType {
  NO,
  SONG_TITLE,
  CHART_TYPE,
  LEVEL,
  ACHIEVEMENT,
  RANK,
  NEXT_RANK,
  RATING,
  NEXT_RATING,
}
