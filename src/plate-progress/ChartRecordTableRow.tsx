import React from 'react';

import {FullChartRecord} from '../common/chart-record';
import {ChartType, getChartTypeName} from '../common/chart-type';

interface Props {
  done?: boolean;
  songNickname: string;
  chartType: ChartType;
  r?: FullChartRecord;
}

export function ChartRecordTableRow({done, r, songNickname, chartType}: Props) {
  if (!r) {
    return (
      <tr>
        <td className={'songName ' + (done ? 'done' : 'undone')} title={songNickname}>
          {songNickname}
        </td>
        <td>{getChartTypeName(chartType)}</td>
        <td className="achv">0.0000%</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
  return (
    <tr>
      <td className={'songName ' + (done ? 'done' : 'undone')} title={songNickname}>
        {songNickname}
      </td>
      <td>{getChartTypeName(chartType)}</td>
      <td className="achv">{r.achievement.toFixed(4) + '%'}</td>
      <td>{hasFullCombo(r.fcap) && '✓'}</td>
      <td>{hasAllPerfect(r.fcap) && '✓'}</td>
      <td>{hasFullSyncDx(r.sync) && '✓'}</td>
    </tr>
  );
}

function hasFullCombo(fcap: string): boolean {
  return ['FC', 'FC+', 'AP', 'AP+'].includes(fcap);
}

function hasAllPerfect(fcap: string): boolean {
  return ['AP', 'AP+'].includes(fcap);
}

function hasFullSyncDx(sync: string): boolean {
  return ['FSD', 'FSD+'].includes(sync);
}
