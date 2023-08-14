import {ChartType} from './chart-type';
import {Difficulty} from './difficulties';

export interface ChartRecord {
  songName: string;
  genre: string;
  difficulty: Difficulty;
  level: number;
  levelIsPrecise?: boolean;
  chartType: ChartType;
  achievement: number;
}

export interface FullChartRecord extends ChartRecord {
  version: number; // GameVersion. -1 if unknown
  fcap: string; // FC, AP, etc.
  sync: string; // FS, FSD, etc.
  dxscore: {max: number; player: number; ratio: number; star: number};
}
