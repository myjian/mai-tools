import React from 'react';

import {DxVersion, getVersionName} from '../../common/game-version';
import {getOfficialLevel} from '../../common/level-helper';
import {GameRegion} from '../types';

function getMaimaiSongsLink(
  officialLv: string,
  gameRegion: GameRegion,
  minGameVer: DxVersion,
  maxGameVer: DxVersion
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
    versions.push(getVersionName(minGameVer));
    minGameVer++;
  }
  q.set("versions", versions.join("|"));
  return "https://maimai-songs.zetaraku.dev/?" + q;
}

interface Props {
  gameRegion: GameRegion;
  gameVer: DxVersion;
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
