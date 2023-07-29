import React from 'react';

import {ChartType} from '../common/chart-type';
import {Difficulty, DIFFICULTY_CLASSNAME_MAP, getDifficultyName} from '../common/difficulties';
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
  const {d} = props;
  console.log(d, props.plateType);
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
      .map((r) => getSongNickname(r.songName, r.genre, ChartType.STANDARD))
  );
  const playedStdSongs = new Set(
    progress[0]
      .concat(progress[1])
      .filter((r) => r.chartType === ChartType.STANDARD)
      .map((r) => getSongNickname(r.songName, r.genre, ChartType.STANDARD))
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
      <h2>
        <span className={DIFFICULTY_CLASSNAME_MAP.get(d)}>{getDifficultyName(d)}</span> scores
      </h2>
      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Achv</th>
            <th>FC</th>
            <th>AP</th>
            <th>Sync</th>
          </tr>
        </thead>
        <tbody>
          {doneRecords.map((r) => (
            <ChartRecordTableRow key={r.songName} done r={r} />
          ))}
          <tr>
            <th colSpan={5}>- - - - - - - -</th>
          </tr>
          {undoneRecords.map((r) => (
            <ChartRecordTableRow key={r.songName} r={r} />
          ))}
          {unplayedStdSongs.map((s) => {
            const nickname = getSongNickname(s, '', ChartType.STANDARD);
            return <ChartRecordTableRow key={nickname} songName={nickname} />;
          })}
          {unplayedDxSongs.map((s) => {
            const nickname = getSongNickname(s, '', ChartType.DX);
            return <ChartRecordTableRow key={nickname} songName={nickname} />;
          })}
        </tbody>
      </table>
    </>
  );
}
