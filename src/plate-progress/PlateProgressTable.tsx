import React from 'react';

import {Difficulty, getDifficultyShortName} from '../common/difficulties';
import {PlateType, ProgressByDifficulty, VersionInfo} from './plate_info';
import {PlateProgressTableCell} from './PlateProgressTableCell';

interface Props {
  activeDifficulties: Difficulty[];
  songCount: Record<Difficulty, number>;
  progressByPlate: Record<PlateType, ProgressByDifficulty>;
  plateNames: VersionInfo['plate_name'];
  selectPlateAndDifficulty: (plate: PlateType, d: Difficulty) => void;
}

export function PlateProgressTable(props: Props) {
  const {activeDifficulties, songCount, plateNames, progressByPlate, selectPlateAndDifficulty} =
    props;
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {activeDifficulties.map((d, idx) => (
            <PlateProgressTableCell key={idx} useTh value={getDifficultyShortName(d)} d={d} />
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Total</th>
          {activeDifficulties.map((d, idx) => (
            <PlateProgressTableCell key={idx} value={songCount[d]} d={d} />
          ))}
        </tr>
        {Object.keys(progressByPlate).map((plateType) => {
          const plateName = plateNames[plateType as PlateType];
          const progressByDifficulty = progressByPlate[plateType as PlateType];
          return (
            <tr key={plateType}>
              <th>{plateName}</th>
              {activeDifficulties.map((d, idx) => (
                <PlateProgressTableCell
                  key={idx}
                  className={songCount[d] === progressByDifficulty[d][1].length ? 'done' : 'undone'}
                  plateType={plateType as PlateType}
                  value={progressByDifficulty[d][1].length}
                  d={d}
                  onClick={selectPlateAndDifficulty}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
