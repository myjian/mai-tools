import {FullChartRecord} from '../common/chart-record';
import {Difficulty} from '../common/difficulties';

export interface VersionInfo {
  version_name: string;
  dx_songs: string[];
  std_songs: string[];
  dx_remaster_songs: string[];
  std_remaster_songs: string[];
  plate_name: {
    CLEAR?: string;
    FC: string;
    SSS?: string;
    AP: string;
    FSD: string;
  };
}

export type PlateType = 'CLEAR' | 'FC' | 'SSS' | 'AP' | 'FSD';

export type RecordsByDone = Record<0 | 1, FullChartRecord[]>;

export type ProgressByDifficulty = Record<Difficulty, RecordsByDone>;
