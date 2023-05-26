import React from 'react';

import {getMaimaiSongsLink} from '../../common/arcade-songs';
import {GameRegion} from '../../common/game-region';
import {GameVersion} from '../../common/game-version';
import {getOfficialLevel} from '../../common/level-helper';

interface Props {
  gameRegion?: GameRegion;
  gameVer?: GameVersion;
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
    const internalLv = lv.toFixed(1);
    const minGameVer = includeOldVersions ? 0 : gameVer;
    return (
      <td className="recLvCell">
        <a
          className="recOfficialLv"
          href={getMaimaiSongsLink(officialLv, false, gameRegion, minGameVer, gameVer)}
          target="_blank"
        >
          {officialLv}
        </a>
        <br />(
        <a
          href={getMaimaiSongsLink(internalLv, true, gameRegion, minGameVer, gameVer)}
          target="_blank"
        >
          {internalLv}
        </a>
        ~)
      </td>
    );
  }
}
