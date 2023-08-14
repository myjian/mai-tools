import {FullChartRecord} from '../common/chart-record';
import {PlateType} from './plate_info';

export function isRecordMatchPlateCriteria(record: FullChartRecord, plateType: PlateType) {
  switch (plateType) {
    case 'CLEAR':
      return record.achievement >= 80;
    case 'SSS':
      return record.achievement >= 100;
    case 'FC':
      return ['FC', 'FC+', 'AP', 'AP+'].includes(record.fcap);
    case 'AP':
      return ['AP', 'AP+'].includes(record.fcap);
    case 'FSD':
      return ['FSD', 'FSD+'].includes(record.sync);
    default:
      throw new Error(`Unknown plateType ${plateType}`);
  }
}
