import {RankDef} from '../common/rank-functions';
import {ChartType} from '../common/song-props';

export interface ChartRecord {
  songName: string;
  genre: string;
  difficulty: string;
  level: number;
  levelIsEstimate: boolean;
  chartType: ChartType;
  achievement: number;
}

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
  DIFFICULTY,
  LEVEL,
  ACHIEVEMENT,
  RANK,
  NEXT_RANK,
  RATING,
  NEXT_RATING,
}
