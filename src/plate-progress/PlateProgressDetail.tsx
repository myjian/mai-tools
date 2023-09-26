import React, {useCallback, useMemo, useState} from 'react';

import {FullChartRecord} from '../common/chart-record';
import {ChartType} from '../common/chart-type';
import {DIFFICULTIES, Difficulty} from '../common/difficulties';
import {getSongNickname} from '../common/song-name-helper';
import {ChartRecordTable} from './ChartRecordTable';
import {PlateType, ProgressByDifficulty, VersionInfo} from './plate_info';
import {isRecordMatchPlateCriteria} from './plate_predicates';
import {PlateProgressTable} from './PlateProgressTable';

interface Props {
  versionInfo: VersionInfo;
  playerScores: FullChartRecord[];
}

export function PlateProgressDetail(props: Props) {
  const {versionInfo, playerScores} = props;
  const [plateType, setPlateType] = useState<PlateType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const handleSelectPlateAndDifficulty = useCallback(
    (plate: PlateType, d: Difficulty) => {
      setPlateType(plate);
      setSelectedDifficulty(d);
    },
    [plateType, selectedDifficulty]
  );
  const allSongs = {
    dx: new Set(versionInfo.dx_songs),
    std: new Set(versionInfo.std_songs),
  };
  const remasterSongs = {
    dx: new Set(versionInfo.dx_remaster_songs),
    std: new Set(versionInfo.std_remaster_songs),
  };
  const songCount = {
    [Difficulty.BASIC]: allSongs.dx.size + allSongs.std.size,
    [Difficulty.ADVANCED]: allSongs.dx.size + allSongs.std.size,
    [Difficulty.EXPERT]: allSongs.dx.size + allSongs.std.size,
    [Difficulty.MASTER]: allSongs.dx.size + allSongs.std.size,
    [Difficulty.ReMASTER]: remasterSongs.dx.size + remasterSongs.std.size,
  };
  const progressByPlate: Record<PlateType, ProgressByDifficulty> = useMemo(() => {
    const result = Object.keys(versionInfo.plate_name).reduce((res, plateType) => {
      res[plateType as PlateType] = createEmptyProgress();
      return res;
    }, {} as Record<PlateType, ProgressByDifficulty>);
    playerScores
      .filter((record) => {
        const nickname = getSongNickname(record.songName, record.genre);
        if (record.difficulty === Difficulty.ReMASTER) {
          return record.chartType === ChartType.STANDARD
            ? remasterSongs.std.has(nickname)
            : remasterSongs.dx.has(nickname);
        }
        return record.chartType === ChartType.STANDARD
          ? allSongs.std.has(nickname)
          : allSongs.dx.has(nickname);
      })
      .forEach((record) => {
        for (const plateType of Object.keys(versionInfo.plate_name)) {
          result[plateType as PlateType][record.difficulty][
            toInt(isRecordMatchPlateCriteria(record, plateType as PlateType))
          ].push(record);
        }
      });
    return result;
  }, [playerScores, versionInfo]);

  if (props.playerScores.length === 0) {
    return null;
  }
  const activeDifficulties = DIFFICULTIES.filter((d) => songCount[d] > 0);

  return (
    <>
      <h3>Completion status of {versionInfo.version_name}</h3>
      <PlateProgressTable
        activeDifficulties={activeDifficulties}
        songCount={songCount}
        progressByPlate={progressByPlate}
        plateNames={versionInfo.plate_name}
        selectPlateAndDifficulty={handleSelectPlateAndDifficulty}
      />
      <ChartRecordTable
        d={selectedDifficulty}
        versionInfo={versionInfo}
        plateType={plateType}
        progressByPlate={progressByPlate}
      />
    </>
  );
}

function toInt(val: boolean): 0 | 1 {
  return Number(val) as 0 | 1;
}

function createEmptyProgress(): ProgressByDifficulty {
  return {
    [Difficulty.BASIC]: {0: [], 1: []},
    [Difficulty.ADVANCED]: {0: [], 1: []},
    [Difficulty.EXPERT]: {0: [], 1: []},
    [Difficulty.MASTER]: {0: [], 1: []},
    [Difficulty.ReMASTER]: {0: [], 1: []},
  };
}
