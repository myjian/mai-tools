export interface SongProperties {
  dx: number;
  lv: ReadonlyArray<number>;
  debut: number;
  songName: string;
  nickname: string;
}

export interface RankDef {
  th: number;
  factor: number;
  title: string;
}

export interface ChartRecord {
  songName: string;
  genre: string;
  difficulty: string;
  level: number;
  levelIsEstimate: boolean;
  chartType: string;
  achievement: number;
  multiplier: number;
  rankFactor: number;
}

export interface ChartRecordWithRating extends ChartRecord {
  rating: number;
  nextRanks?: Map<string, {minRt: number, rank: RankDef}>;
}

export interface RatingData {
  oldChartsRating: number;
  oldTopChartsCount: number;
  oldChartRecords: ChartRecordWithRating[];
  newChartsRating: number;
  newTopChartsCount: number;
  newChartRecords: ChartRecordWithRating[];
}
