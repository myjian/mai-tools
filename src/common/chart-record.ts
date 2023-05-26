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
  // TODO
  version?: number; // GameVersion
  // rank: string; // AAA, S, SS, etc.
  // fcap: string; // FC, AP, etc.
  // sync: string; // FS, FSD, etc.
  // dxscore: string; // score/full score. Example: 920/1002
  // dxratio: number; // Example: 0.918
}
