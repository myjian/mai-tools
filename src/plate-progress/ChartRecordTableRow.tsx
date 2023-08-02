import React from 'react';

import {FullChartRecord} from '../common/chart-record';
import {ChartType} from '../common/chart-type';
import {getSongNickname} from '../common/song-name-helper';

interface Props {
  done?: boolean;
  songName?: string;
  r?: FullChartRecord;
}

export function ChartRecordTableRow({done, r, songName}: Props) {
  if (!r) {
    return (
      <tr>
        <td className={'songName ' + (done ? 'done' : 'undone')} title={songName}>
          {songName}
        </td>
        <td className="achv">0.0000%</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
  return (
    <tr>
      <td className={'songName ' + (done ? 'done' : 'undone')} title={r.songName}>
        {getSongNickname(r.songName, r.genre, ChartType.STANDARD)}
      </td>
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
