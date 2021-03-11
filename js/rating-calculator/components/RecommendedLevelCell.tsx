import React from 'react';

import {getOfficialLevel} from '../../common/level-helper';
import {GameRegion} from '../types';

const VERSION_NAMES = [
  "maimai",
  "maimai PLUS",
  "GreeN",
  "GreeN PLUS",
  "ORANGE",
  "ORANGE PLUS",
  "PiNK",
  "PiNK PLUS",
  "MURASAKi",
  "MURASAKi PLUS",
  "MiLK",
  "MiLK PLUS",
  "FiNALE",
  "でらっくす",
  "でらっくす PLUS",
  "Splash",
  "Splash PLUS",
];

function getMaimaiSongsLink(
  officialLv: string,
  gameRegion: GameRegion,
  minGameVer: number,
  maxGameVer: number
) {
  officialLv = officialLv.replace("+", ".5");
  const q = new URLSearchParams();
  q.set("maxLevelValue", officialLv);
  q.set("minLevelValue", officialLv);
  if (gameRegion === GameRegion.Intl) {
    q.set("region", "intl");
  }
  const versions: string[] = [];
  while (minGameVer <= maxGameVer) {
    versions.push(VERSION_NAMES[minGameVer]);
    minGameVer++;
  }
  q.set("versions", versions.join("|"));
  return "https://maimai-songs.zetaraku.dev/?" + q;
}

interface Props {
  gameRegion: GameRegion;
  gameVer: number;
  lv: number;
  includeOldVersions?: boolean;
}

export class RecommendedLevelCell extends React.PureComponent<Props> {
  render() {
    const {gameRegion, gameVer, lv, includeOldVersions} = this.props;
    if (lv < 0) {
      return <td>--</td>;
    }
    const officialLv = getOfficialLevel(lv);
    return (
      <td>
        <a
          href={getMaimaiSongsLink(
            officialLv,
            gameRegion,
            includeOldVersions ? 0 : gameVer,
            gameVer
          )}
          target="_blank"
        >
          {officialLv}
        </a>
        <br />({lv.toFixed(1)}~)
      </td>
    );
  }
}
