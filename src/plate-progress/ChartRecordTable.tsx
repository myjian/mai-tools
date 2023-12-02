import React from 'react';

import {ChartType} from '../common/chart-type';
import {Difficulty, getDifficultyClassName, getDifficultyName} from '../common/difficulties';
import {getSongNickname} from '../common/song-name-helper';
import {ChartRecordTableRow} from './ChartRecordTableRow';
import {PlateType, ProgressByDifficulty, VersionInfo} from './plate_info';

interface Props {
  d: Difficulty | null;
  versionInfo: VersionInfo;
  plateType: PlateType;
  progressByPlate: Record<PlateType, ProgressByDifficulty>;
}

export function ChartRecordTable(props: Props) {
  const {d, versionInfo, plateType} = props;
  if (typeof d !== 'number') {
    return null;
  }
  const progressByDifficulty = props.progressByPlate[props.plateType];
  if (!progressByDifficulty) {
    return null;
  }
  const progress = progressByDifficulty[props.d];
  const doneRecords = progress[1].slice().sort((a, b) => {
    return a.achievement > b.achievement ? -1 : 1;
  });
  const undoneRecords = progress[0].slice().sort((a, b) => {
    return a.achievement > b.achievement ? -1 : 1;
  });

  const playedDxSongs = new Set(
    progress[0]
      .concat(progress[1])
      .filter((r) => r.chartType === ChartType.DX)
      .map((r) => getSongNickname(r.songName, r.genre))
  );
  const playedStdSongs = new Set(
    progress[0]
      .concat(progress[1])
      .filter((r) => r.chartType === ChartType.STANDARD)
      .map((r) => getSongNickname(r.songName, r.genre))
  );
  const unplayedDxSongs = (
    props.d === Difficulty.ReMASTER
      ? props.versionInfo.dx_remaster_songs
      : props.versionInfo.dx_songs
  ).filter((s) => !playedDxSongs.has(s));
  const unplayedStdSongs = (
    props.d === Difficulty.ReMASTER
      ? props.versionInfo.std_remaster_songs
      : props.versionInfo.std_songs
  ).filter((s) => !playedStdSongs.has(s));

  // Highlight sort column based on plateType
  return (
    <>
      <h3>
        <span className={getDifficultyClassName(d)}>{getDifficultyName(d)}</span> scores for{' '}
        {versionInfo.plate_name[plateType]}
      </h3>
      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Chart</th>
            <th>{plateType === 'CLEAR' || plateType === 'SSS' ? '▸ ' : ''}Achv</th>
            <th>{plateType === 'FC' ? '▸ ' : ''}FC</th>
            <th>{plateType === 'AP' ? '▸ ' : ''}AP</th>
            <th>{plateType === 'FSD' ? '▸ ' : ''}Sync</th>
          </tr>
        </thead>
        <tbody>
          {doneRecords.map((r) => {
            const nickname = getSongNickname(r.songName, r.genre);
            return (
              <ChartRecordTableRow
                key={nickname}
                songNickname={nickname}
                chartType={r.chartType}
                done
                r={r}
              />
            );
          })}
          <tr>
            <th colSpan={5}>- - - - - - - -</th>
          </tr>
          {undoneRecords.map((r) => {
            const nickname = getSongNickname(r.songName, r.genre);
            return (
              <ChartRecordTableRow
                key={nickname}
                songNickname={nickname}
                chartType={r.chartType}
                r={r}
              />
            );
          })}
          {unplayedStdSongs.map((songName) => {
            return (
              <ChartRecordTableRow
                key={songName}
                songNickname={songName}
                chartType={ChartType.STANDARD}
              />
            );
          })}
          {unplayedDxSongs.map((songName) => {
            return (
              <ChartRecordTableRow
                key={songName}
                songNickname={songName}
                chartType={ChartType.DX}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
